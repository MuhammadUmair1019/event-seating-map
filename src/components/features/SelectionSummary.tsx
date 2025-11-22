"use client";

import React from "react";
import { useSelectionSummary } from "@/hooks/useSelectionSummary";
import { getPrice } from "@/utils/priceTiers";

export default function SelectionSummary() {
  const {
    selectedSeats,
    subtotal,
    maxSeats,
    isMaxReached,
    removeSeat,
    clearSelection,
  } = useSelectionSummary();

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
          Your Selection
        </h3>
        <button
          onClick={clearSelection}
          className="text-sm text-red-600 dark:text-red-400 hover:underline"
          aria-label="Clear all selections"
        >
          Clear All
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {selectedSeats.length} of {maxSeats} seats selected
        </p>
        {isMaxReached && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
            Maximum seats reached
          </p>
        )}
      </div>

      {selectedSeats.length > 0 && (
        <>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {selectedSeats.map((seat) => (
              <div
                key={seat.id}
                className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {seat.id}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {seat.sectionLabel} • Row {seat.rowIndex}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    ${getPrice(seat.priceTier).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeSeat(seat.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                    aria-label={`Remove seat ${seat.id}`}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Subtotal
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )}

      {selectedSeats.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          No seats selected yet
        </p>
      )}
    </div>
  );
}

