"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useAppStore } from "@/store/useAppStore";

export default function Controls() {
  const { theme, setTheme } = useTheme();
  const heatMapMode = useAppStore((state) => state.heatMapMode);
  const toggleHeatMap = useAppStore((state) => state.toggleHeatMap);
  const resetView = useAppStore((state) => state.resetView);

  const isDark = theme === "dark";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button
          onClick={toggleHeatMap}
          className={`px-4 py-2 rounded transition-colors ${
            heatMapMode
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
          aria-label={heatMapMode ? "Disable heat map" : "Enable heat map"}
        >
          🔥 Heat Map
        </button>

        <button
          onClick={resetView}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Reset zoom and pan"
        >
          🔍 Reset View
        </button>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs text-gray-700 dark:text-gray-300">
        <p className="hidden md:block">
          💡 <strong>Tip:</strong> Use mouse wheel to zoom, drag to pan • Mobile: Pinch to zoom, drag to pan
        </p>
        <p className="md:hidden">
          💡 <strong>Tip:</strong> Pinch to zoom, drag to pan
        </p>
      </div>
    </div>
  );
}

