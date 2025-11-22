import { useMemo } from "react";
import { useSeatStore } from "@/store/useSeatStore";
import { getPrice } from "@/utils/priceTiers";

export function useSelectionSummary() {
  const selectedSeats = useSeatStore((state) => state.selectedSeats);
  const removeSeat = useSeatStore((state) => state.removeSeat);
  const clearSelection = useSeatStore((state) => state.clearSelection);
  const maxSeats = useSeatStore((state) => state.maxSeats);

  const subtotal = useMemo(
    () => selectedSeats.reduce((sum, seat) => sum + getPrice(seat.priceTier), 0),
    [selectedSeats]
  );

  const isMaxReached = selectedSeats.length >= maxSeats;

  return {
    selectedSeats,
    subtotal,
    maxSeats,
    isMaxReached,
    removeSeat,
    clearSelection,
  };
}

