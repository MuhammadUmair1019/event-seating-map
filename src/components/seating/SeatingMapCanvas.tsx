"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import type { Venue } from "@/types/venue";
import { useAppStore } from "@/store/useAppStore";
import { useSeatStore } from "@/store/useSeatStore";
import { getSeatColor, getSeatOpacity } from "@/utils/seatColors";
import { useViewportCulling } from "@/hooks/useViewportCulling";
import { useSeatInteraction } from "@/hooks/useSeatInteraction";

interface SeatingMapCanvasProps {
  venue: Venue;
}

export default function SeatingMapCanvas({ venue }: SeatingMapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [focusedSeatIndex, setFocusedSeatIndex] = useState<number | null>(null);
  const animationFrameRef = useRef<number>();

  const zoom = useAppStore((state) => state.zoom);
  const panX = useAppStore((state) => state.panX);
  const panY = useAppStore((state) => state.panY);
  const setZoom = useAppStore((state) => state.setZoom);
  const setPan = useAppStore((state) => state.setPan);
  const heatMapMode = useAppStore((state) => state.heatMapMode);
  const isSelected = useSeatStore((state) => state.isSelected);
  const selectedSeats = useSeatStore((state) => state.selectedSeats);
  const setFocusedSeat = useAppStore((state) => state.setFocusedSeat);

  // Use custom hooks for viewport culling and seat interaction
  const { visibleSeats } = useViewportCulling({
    venue,
    zoom,
    panX,
    panY,
    containerRef,
  });

  const { handleSeatInteraction } = useSeatInteraction();

  // Render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas - check dark mode
    const isDark =
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    ctx.fillStyle = isDark ? "#111827" : "#f3f4f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply transform
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    const baseSeatSize = Math.max(8, 12 * zoom);
    const strokeWidth = 1;

      // Render visible seats
    for (const seat of visibleSeats) {
      const selected = isSelected(seat.id);
      const color = getSeatColor(seat.status, seat.priceTier, selected, heatMapMode);
      const opacity = getSeatOpacity(seat.status);

      // Make selected seats larger and more prominent
      const seatSize = selected ? baseSeatSize * 1.3 : baseSeatSize;

      ctx.save();
      ctx.globalAlpha = opacity;
      
      // Draw outer glow for selected seats
      if (selected) {
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#3b82f6";
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(seat.x, seat.y, seatSize + 2, 0, Math.PI * 2);
        ctx.fillStyle = "#3b82f6";
        ctx.fill();
        ctx.restore();
      }

      // Draw seat fill
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(seat.x, seat.y, seatSize, 0, Math.PI * 2);
      ctx.fill();

      // Draw seat border
      ctx.strokeStyle = selected ? "#1e40af" : "#000000";
      ctx.lineWidth = selected ? 3 : strokeWidth;
      ctx.stroke();

      // Draw checkmark for selected seats
      if (selected) {
        ctx.save();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = Math.max(2, 2 * zoom);
        ctx.globalAlpha = 1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        const checkSize = seatSize * 0.35;
        ctx.beginPath();
        // Draw checkmark: bottom-left to center, then center to top-right
        ctx.moveTo(seat.x - checkSize * 0.4, seat.y);
        ctx.lineTo(seat.x - checkSize * 0.1, seat.y + checkSize * 0.3);
        ctx.lineTo(seat.x + checkSize * 0.4, seat.y - checkSize * 0.3);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    }

    // Highlight focused seat for keyboard navigation (render on top)
    if (focusedSeatIndex !== null) {
      const availableSeats = visibleSeats.filter((s) => s.status === "available");
      const focusedSeat = availableSeats[focusedSeatIndex];
      if (focusedSeat) {
        const focusedSeatSize = Math.max(8, 12 * zoom);
        ctx.save();
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 3;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(focusedSeat.x, focusedSeat.y, focusedSeatSize + 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.restore();
  }, [visibleSeats, zoom, panX, panY, heatMapMode, isSelected, focusedSeatIndex]);

  // Render on changes
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [render, focusedSeatIndex, selectedSeats.length]);


  // Handle click - event delegation
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - panX) / zoom;
      const y = (e.clientY - rect.top - panY) / zoom;

      const baseSeatSize = Math.max(8, 12 * zoom);
      // Larger click radius to account for selected seats being bigger
      const clickRadius = baseSeatSize * 1.8;

      // Find clicked seat (check visible seats first for performance)
      let clickedSeat: typeof visibleSeats[0] | null = null;
      let minDistance = Infinity;

      for (const seat of visibleSeats) {
        const dx = x - seat.x;
        const dy = y - seat.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= clickRadius && distance < minDistance) {
          minDistance = distance;
          clickedSeat = seat;
        }
      }

      if (clickedSeat) {
        handleSeatInteraction(clickedSeat);
        // Force re-render to show selection feedback immediately
        render();
      }
    },
    [visibleSeats, zoom, panX, panY, handleSeatInteraction, render]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLCanvasElement>) => {
      const availableSeats = visibleSeats.filter((s) => s.status === "available");
      if (availableSeats.length === 0) return;

      let newIndex = focusedSeatIndex ?? 0;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          newIndex = (newIndex + 1) % availableSeats.length;
          setFocusedSeatIndex(newIndex);
          // Just focus, don't select on arrow keys
          const nextSeat = availableSeats[newIndex];
          setFocusedSeat({
            ...nextSeat,
            sectionId: nextSeat.sectionId,
            sectionLabel: nextSeat.sectionLabel,
            rowIndex: nextSeat.rowIndex,
          });
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          newIndex = newIndex <= 0 ? availableSeats.length - 1 : newIndex - 1;
          setFocusedSeatIndex(newIndex);
          // Just focus, don't select on arrow keys
          const prevSeat = availableSeats[newIndex];
          if (prevSeat) {
          setFocusedSeat({
            ...prevSeat,
            sectionId: prevSeat.sectionId,
            sectionLabel: prevSeat.sectionLabel,
            rowIndex: prevSeat.rowIndex,
            } as typeof prevSeat & { sectionId: string; sectionLabel: string; rowIndex: number });
          }
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          e.stopPropagation();
          if (focusedSeatIndex !== null) {
            handleSeatInteraction(availableSeats[focusedSeatIndex]);
          }
          break;
        case "Home":
          e.preventDefault();
          e.stopPropagation();
          setFocusedSeatIndex(0);
          const firstSeat = availableSeats[0];
          if (firstSeat) {
          setFocusedSeat({
            ...firstSeat,
            sectionId: firstSeat.sectionId,
            sectionLabel: firstSeat.sectionLabel,
            rowIndex: firstSeat.rowIndex,
            } as typeof firstSeat & { sectionId: string; sectionLabel: string; rowIndex: number });
          }
          break;
        case "End":
          e.preventDefault();
          e.stopPropagation();
          setFocusedSeatIndex(availableSeats.length - 1);
          const lastSeat = availableSeats[availableSeats.length - 1];
          if (lastSeat) {
          setFocusedSeat({
            ...lastSeat,
            sectionId: lastSeat.sectionId,
            sectionLabel: lastSeat.sectionLabel,
            rowIndex: lastSeat.rowIndex,
            } as typeof lastSeat & { sectionId: string; sectionLabel: string; rowIndex: number });
          }
          break;
      }
    },
    [visibleSeats, focusedSeatIndex, handleSeatInteraction, setFocusedSeat] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      // Prevent page scroll
      if (e.cancelable) {
        e.preventDefault();
      }
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.5, Math.min(3, zoom + delta));
      setZoom(newZoom);
    },
    [zoom, setZoom]
  );

  // Mouse drag for panning
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button === 0) {
        setIsDragging(true);
        setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
      }
    },
    [panX, panY]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging) {
        setPan(e.clientX - dragStart.x, e.clientY - dragStart.y);
      }
    },
    [isDragging, dragStart, setPan]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch gestures
  const [touchStart, setTouchStart] = useState<{
    distance: number;
    centerX: number;
    centerY: number;
  } | null>(null);

  const getTouchDistance = (touches: React.TouchList): number => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    if (!touch1 || !touch2) return 0;
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 2) {
        const distance = getTouchDistance(e.touches);
        const center = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
        setTouchStart({ distance, centerX: center.x, centerY: center.y });
      } else if (e.touches.length === 1) {
        const touch = e.touches[0];
        setDragStart({ x: touch.clientX - panX, y: touch.clientY - panY });
        setIsDragging(true);
      }
    },
    [panX, panY]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 2 && touchStart) {
        const newDistance = getTouchDistance(e.touches);
        const scale = newDistance / touchStart.distance;
        const newZoom = Math.max(0.5, Math.min(3, zoom * scale));
        setZoom(newZoom);
      } else if (e.touches.length === 1 && isDragging) {
        const touch = e.touches[0];
        setPan(touch.clientX - dragStart.x, touch.clientY - dragStart.y);
      }
    },
    [touchStart, zoom, isDragging, dragStart, setZoom, setPan]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setTouchStart(null);
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      render();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [render]);

  // Prevent page scroll on wheel events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelPassive = (e: WheelEvent) => {
      // Only prevent if we're actually over the container
      if (container.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    // Use capture phase to catch events early
    container.addEventListener("wheel", handleWheelPassive, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheelPassive);
    };
  }, []);

  // Focus canvas on mount and when clicking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        canvas.focus();
      }, 100);
    }
  }, []);

  const handleContainerClick = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.focus();
    }
  }, []);

  // Reset focused seat index when visible seats change (e.g., after pan/zoom)
  useEffect(() => {
    if (focusedSeatIndex !== null) {
      const availableSeats = visibleSeats.filter((s) => s.status === "available");
      if (focusedSeatIndex >= availableSeats.length) {
        setFocusedSeatIndex(null);
      }
    }
  }, [visibleSeats, focusedSeatIndex]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-900 relative seating-map-container"
      style={{
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onWheel={handleWheel}
      onMouseDown={(e) => {
        handleContainerClick();
        handleMouseDown(e);
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full outline-none"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          // Ensure canvas stays focused
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.focus();
          }
        }}
        aria-label="Interactive seating map. Use arrow keys to navigate, Enter or Space to select seats."
        role="application"
        tabIndex={0}
      />
    </div>
  );
}

