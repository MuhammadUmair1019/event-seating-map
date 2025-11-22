import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SeatWithDetails } from "@/types/venue";

interface AppStore {
  heatMapMode: boolean;
  showSeatDetails: boolean;
  selectedSeatId: string | null;
  focusedSeat: SeatWithDetails | null;
  zoom: number;
  panX: number;
  panY: number;
  toggleHeatMap: () => void;
  setSelectedSeatId: (id: string | null) => void;
  setFocusedSeat: (seat: SeatWithDetails | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
}

export const useAppStore = create<AppStore>()(
  persist<AppStore>(
    (set) => ({
      heatMapMode: false,
      showSeatDetails: false,
      selectedSeatId: null,
      focusedSeat: null,
      zoom: 1,
      panX: 0,
      panY: 0,

      toggleHeatMap: () => {
        set((state) => ({ heatMapMode: !state.heatMapMode }));
      },

      setSelectedSeatId: (id: string | null) => {
        set({ selectedSeatId: id });
      },

      setFocusedSeat: (seat: SeatWithDetails | null) => {
        set({ focusedSeat: seat });
      },

      setZoom: (zoom: number) => {
        set({ zoom: Math.max(0.5, Math.min(3, zoom)) });
      },

      setPan: (x: number, y: number) => {
        set({ panX: x, panY: y });
      },

      resetView: () => {
        set({ zoom: 1, panX: 0, panY: 0 });
      },
    }),
    {
      name: "app-settings-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

