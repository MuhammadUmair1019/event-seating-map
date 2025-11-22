import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useSeatStore } from "@/store/useSeatStore";
import { getPrice, getPriceLabel } from "@/utils/priceTiers";

export function useSeatDetails() {
  const focusedSeat = useAppStore((state) => state.focusedSeat);
  const selectedSeatId = useAppStore((state) => state.selectedSeatId);
  const selectedSeats = useSeatStore((state) => state.selectedSeats);

  // Prefer focused seat, fallback to selected seat
  const seat = useMemo(() => {
    return (
      focusedSeat ??
      (selectedSeatId
        ? (selectedSeats.find((s) => s.id === selectedSeatId) ?? null)
        : null)
    );
  }, [focusedSeat, selectedSeatId, selectedSeats]);

  const price = seat ? getPrice(seat.priceTier) : 0;
  const priceLabel = seat ? getPriceLabel(seat.priceTier) : "";

  return {
    seat,
    price,
    priceLabel,
  };
}
