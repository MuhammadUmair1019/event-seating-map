import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SeatWithDetails } from "@/types/venue";

interface SeatStore {
  selectedSeats: SeatWithDetails[];
  maxSeats: number;
  addSeat: (seat: SeatWithDetails) => boolean;
  removeSeat: (seatId: string) => void;
  clearSelection: () => void;
  isSelected: (seatId: string) => boolean;
  canSelectMore: () => boolean;
}

export const useSeatStore = create<SeatStore>()(
  persist<SeatStore>(
    (set, get) => ({
      selectedSeats: [],
      maxSeats: 8,

      addSeat: (seat: SeatWithDetails) => {
        const state = get();
        if (state.selectedSeats.length >= state.maxSeats) {
          return false;
        }
        if (state.selectedSeats.some((s: SeatWithDetails) => s.id === seat.id)) {
          return false;
        }
        set((state) => ({
          selectedSeats: [...state.selectedSeats, seat],
        }));
        return true;
      },

      removeSeat: (seatId: string) => {
        set((state) => ({
          selectedSeats: state.selectedSeats.filter((s: SeatWithDetails) => s.id !== seatId),
        }));
      },

      clearSelection: () => {
        set({ selectedSeats: [] });
      },

      isSelected: (seatId: string) => {
        return get().selectedSeats.some((s: SeatWithDetails) => s.id === seatId);
      },

      canSelectMore: () => {
        return get().selectedSeats.length < get().maxSeats;
      },
    }),
    {
      name: "seat-selection-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

