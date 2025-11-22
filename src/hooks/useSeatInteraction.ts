import { useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useSeatStore } from "@/store/useSeatStore";
import type { SeatWithDetails, Seat } from "@/types/venue";

// Match the VisibleSeat type from useViewportCulling
export interface VisibleSeat extends Seat {
  sectionId: string;
  sectionLabel: string;
  rowIndex: number;
}

export function useSeatInteraction() {
  const isSelected = useSeatStore((state) => state.isSelected);
  const addSeat = useSeatStore((state) => state.addSeat);
  const removeSeat = useSeatStore((state) => state.removeSeat);
  const canSelectMore = useSeatStore((state) => state.canSelectMore);
  const setFocusedSeat = useAppStore((state) => state.setFocusedSeat);
  const setSelectedSeatId = useAppStore((state) => state.setSelectedSeatId);

  const handleSeatInteraction = useCallback(
    (seat: VisibleSeat) => {
      if (seat.status !== "available") return;

      const seatWithDetails: SeatWithDetails = {
        ...seat,
        sectionId: seat.sectionId,
        sectionLabel: seat.sectionLabel,
        rowIndex: seat.rowIndex,
      } as SeatWithDetails;

      setFocusedSeat(seatWithDetails);

      if (isSelected(seat.id)) {
        removeSeat(seat.id);
        setSelectedSeatId(null);
      } else {
        if (canSelectMore()) {
          addSeat(seatWithDetails);
          setSelectedSeatId(seat.id);
        }
      }
    },
    [isSelected, addSeat, removeSeat, setFocusedSeat, setSelectedSeatId, canSelectMore]
  );

  return {
    handleSeatInteraction,
  };
}

