import { useCallback } from "react";
import { toast } from "sonner";
import { useSeatStore } from "@/store/useSeatStore";
import type { Venue, SeatWithDetails } from "@/types/venue";

interface UseFindAdjacentSeatsProps {
  venue: Venue;
  numSeats: number;
}

export function useFindAdjacentSeats({ venue, numSeats }: UseFindAdjacentSeatsProps) {
  const addSeat = useSeatStore((state) => state.addSeat);
  const selectedSeats = useSeatStore((state) => state.selectedSeats);
  const maxSeats = useSeatStore((state) => state.maxSeats);

  const findAdjacentSeats = useCallback(() => {
    const currentSelectedCount = selectedSeats.length;
    const seatsNeeded = numSeats;
    const totalNeeded = currentSelectedCount + seatsNeeded;

    // Check if we can add the requested number of seats
    if (totalNeeded > maxSeats) {
      const availableSlots = maxSeats - currentSelectedCount;
      toast.error(
        `Cannot add ${seatsNeeded} seats. You can only add ${availableSlots} more seat${availableSlots !== 1 ? "s" : ""}.`
      );
      return;
    }

    // Try to find N adjacent seats in the same row
    for (const section of venue.sections) {
      for (const row of section.rows) {
        // Filter available seats and exclude already selected ones
        const availableSeats = row.seats.filter(
          (s) => s.status === "available" && !selectedSeats.some((selected) => selected.id === s.id)
        );

        if (availableSeats.length < numSeats) continue;

        // Sort by column
        availableSeats.sort((a, b) => a.col - b.col);

        // Find consecutive seats
        for (let i = 0; i <= availableSeats.length - numSeats; i++) {
          const consecutive = availableSeats.slice(i, i + numSeats);

          // Check if they're truly adjacent (col numbers are consecutive)
          const isAdjacent = consecutive.every((seat, idx) => {
            if (idx === 0) return true;
            return seat.col === consecutive[idx - 1].col + 1;
          });

          if (isAdjacent) {
            // Add these seats to the current selection (don't clear)
            let allAdded = true;
            consecutive.forEach((seat) => {
              const seatWithDetails: SeatWithDetails = {
                ...seat,
                sectionId: section.id,
                sectionLabel: section.label,
                rowIndex: row.index,
              };
              const added = addSeat(seatWithDetails);
              if (!added) allAdded = false;
            });

            if (allAdded) {
              toast.success(`Found ${numSeats} adjacent seat${numSeats !== 1 ? "s" : ""}!`);
            } else {
              toast.warning("Some seats could not be added.");
            }
            return;
          }
        }
      }
    }

    // No adjacent seats found
    toast.error(`Could not find ${numSeats} adjacent seat${numSeats !== 1 ? "s" : ""}.`);
  }, [venue, numSeats, selectedSeats, addSeat, maxSeats]);

  return {
    findAdjacentSeats,
    selectedSeats,
    maxSeats,
  };
}

