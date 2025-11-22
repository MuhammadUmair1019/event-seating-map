"use client";

import React from "react";
import type { Seat, SeatWithDetails } from "@/types/venue";
import { getSeatColor, getSeatOpacity } from "@/utils/seatColors";
import { useSeatStore } from "@/store/useSeatStore";
import { useAppStore } from "@/store/useAppStore";

interface SeatProps {
  seat: Seat;
  sectionId: string;
  sectionLabel: string;
  rowIndex: number;
  zoom: number;
}

const SeatComponent = React.memo<SeatProps>(
  ({ seat, sectionId, sectionLabel, rowIndex, zoom }) => {
    const isSelected = useSeatStore((state) => state.isSelected(seat.id));
    const addSeat = useSeatStore((state) => state.addSeat);
    const removeSeat = useSeatStore((state) => state.removeSeat);
    const canSelectMore = useSeatStore((state) => state.canSelectMore);
    const heatMapMode = useAppStore((state) => state.heatMapMode);
    const setSelectedSeatId = useAppStore((state) => state.setSelectedSeatId);

    const color = getSeatColor(
      seat.status,
      seat.priceTier,
      isSelected,
      heatMapMode
    );
    const opacity = getSeatOpacity(seat.status);
    const isClickable = seat.status === "available";

    const handleClick = () => {
      if (!isClickable) return;

      const seatWithDetails: SeatWithDetails = {
        ...seat,
        sectionId,
        sectionLabel,
        rowIndex,
      };

      // Show details on click
      setFocusedSeat(seatWithDetails);

      if (isSelected) {
        removeSeat(seat.id);
        setSelectedSeatId(null);
      } else {
        if (canSelectMore()) {
          addSeat(seatWithDetails);
          setSelectedSeatId(seat.id);
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    };

    const setFocusedSeat = useAppStore((state) => state.setFocusedSeat);

    const handleFocus = () => {
      setFocusedSeat({
        ...seat,
        sectionId,
        sectionLabel,
        rowIndex,
      });
    };

    const handleBlur = () => {
      // Don't clear immediately to allow for smooth transitions
      setTimeout(() => {
        setFocusedSeat(null);
      }, 100);
    };

    const seatSize = Math.max(8, 12 * zoom);
    const strokeWidth = isSelected ? 2 : 1;

    return (
      <g>
        <circle
          cx={seat.x}
          cy={seat.y}
          r={seatSize}
          fill={color}
          opacity={opacity}
          stroke={isSelected ? "#1e40af" : "currentColor"}
          strokeWidth={strokeWidth}
          className={`transition-all duration-150 ${
            isClickable
              ? "cursor-pointer hover:opacity-100 hover:scale-110"
              : "cursor-not-allowed"
          }`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={isClickable ? 0 : -1}
          aria-label={`Seat ${seat.id}, ${sectionLabel}, Row ${rowIndex}, ${
            seat.status === "available" ? "Available" : seat.status
          }`}
          role="button"
          aria-pressed={isSelected}
        />
      </g>
    );
  }
);

SeatComponent.displayName = "Seat";

export default SeatComponent;

