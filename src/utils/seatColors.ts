import type { SeatStatus } from "@/types/venue";
import { getHeatMapColor } from "./priceTiers";

export const getSeatColor = (
  status: SeatStatus,
  priceTier: number,
  isSelected: boolean,
  heatMapMode: boolean
): string => {
  if (isSelected) {
    return "#3b82f6"; // blue-500
  }

  if (heatMapMode) {
    return getHeatMapColor(priceTier);
  }

  switch (status) {
    case "available":
      return "#22c55e"; // green-500
    case "reserved":
      return "#f59e0b"; // amber-500
    case "sold":
      return "#ef4444"; // red-500
    case "held":
      return "#8b5cf6"; // violet-500
    default:
      return "#6b7280"; // gray-500
  }
};

export const getSeatOpacity = (status: SeatStatus): number => {
  switch (status) {
    case "available":
      return 1;
    case "reserved":
      return 0.7;
    case "sold":
      return 0.5; 
    case "held":
      return 0.8;
    default:
      return 0.5;
  }
};

