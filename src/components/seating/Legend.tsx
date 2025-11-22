"use client";

import { useAppStore } from "@/store/useAppStore";
import { getPrice, getPriceLabel } from "@/utils/priceTiers";
import { getHeatMapColor } from "@/utils/priceTiers";

export default function Legend() {
  const heatMapMode = useAppStore((state) => state.heatMapMode);

  if (heatMapMode) {
    return (
      <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: getHeatMapColor(1) }}
          ></div>
          <span>
            Tier 1: {getPriceLabel(1)} (${getPrice(1).toFixed(0)})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: getHeatMapColor(2) }}
          ></div>
          <span>
            Tier 2: {getPriceLabel(2)} (${getPrice(2).toFixed(0)})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: getHeatMapColor(3) }}
          ></div>
          <span>
            Tier 3: {getPriceLabel(3)} (${getPrice(3).toFixed(0)})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: getHeatMapColor(4) }}
          ></div>
          <span>
            Tier 4: {getPriceLabel(4)} (${getPrice(4).toFixed(0)})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span>Selected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-green-500"></div>
        <span>Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-amber-500 opacity-70"></div>
        <span>Reserved</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-red-500 opacity-80"></div>
        <span>Sold</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-violet-500 opacity-80"></div>
        <span>Held</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
        <span>Selected</span>
      </div>
    </div>
  );
}

