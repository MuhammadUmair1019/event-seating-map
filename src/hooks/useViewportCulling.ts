import { useMemo, useCallback, useRef } from "react";
import type { Venue, Seat } from "@/types/venue";

interface VisibleSeat extends Seat {
  sectionId: string;
  sectionLabel: string;
  rowIndex: number;
}

interface UseViewportCullingProps {
  venue: Venue;
  zoom: number;
  panX: number;
  panY: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function useViewportCulling({
  venue,
  zoom,
  panX,
  panY,
  containerRef,
}: UseViewportCullingProps) {
  // Flatten all seats with metadata for faster access
  const allSeats = useMemo(() => {
    const seats: VisibleSeat[] = [];
    venue.sections.forEach((section) => {
      section.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          seats.push({
            ...seat,
            sectionId: section.id,
            sectionLabel: section.label,
            rowIndex: row.index,
          });
        });
      });
    });
    return seats;
  }, [venue]);

  // Calculate viewport bounds for culling
  const getViewportBounds = useCallback(() => {
    if (!containerRef.current) {
      return { minX: 0, minY: 0, maxX: venue.map.width, maxY: venue.map.height };
    }

    const rect = containerRef.current.getBoundingClientRect();
    const scale = zoom;
    const offsetX = -panX / scale;
    const offsetY = -panY / scale;
    const viewWidth = rect.width / scale;
    const viewHeight = rect.height / scale;

    // Add padding for smooth scrolling
    const padding = 100;
    return {
      minX: offsetX - padding,
      minY: offsetY - padding,
      maxX: offsetX + viewWidth + padding,
      maxY: offsetY + viewHeight + padding,
    };
  }, [zoom, panX, panY, venue.map.width, venue.map.height, containerRef]);

  // Get visible seats (viewport culling)
  const visibleSeats = useMemo(() => {
    const bounds = getViewportBounds();
    return allSeats.filter((seat) => {
      const seatSize = Math.max(8, 12 * zoom);
      return (
        seat.x + seatSize >= bounds.minX &&
        seat.x - seatSize <= bounds.maxX &&
        seat.y + seatSize >= bounds.minY &&
        seat.y - seatSize <= bounds.maxY
      );
    });
  }, [allSeats, getViewportBounds, zoom]);

  return {
    visibleSeats,
    allSeats,
  };
}

