"use client";

import React, { useState } from "react";
import { useSeatStore } from "@/store/useSeatStore";
import { useFindAdjacentSeats } from "@/hooks/useFindAdjacentSeats";
import type { Venue } from "@/types/venue";

interface FindAdjacentSeatsProps {
  venue: Venue;
}

export default function FindAdjacentSeats({ venue }: FindAdjacentSeatsProps) {
  const [numSeats, setNumSeats] = useState(2);
  const selectedSeats = useSeatStore((state) => state.selectedSeats);
  const maxSeats = useSeatStore((state) => state.maxSeats);

  const { findAdjacentSeats } = useFindAdjacentSeats({ venue, numSeats });

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
        Find Adjacent Seats
      </h3>
      <div className="flex gap-2 items-center">
        <label
          htmlFor="num-seats"
          className="text-sm text-gray-700 dark:text-gray-300"
        >
          Number of seats:
        </label>
        <input
          id="num-seats"
          type="number"
          min="1"
          max={maxSeats}
          value={numSeats}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 1;
            const maxAllowed = maxSeats - selectedSeats.length;
            setNumSeats(Math.max(1, Math.min(maxSeats, value, maxAllowed || maxSeats)));
          }}
          className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          aria-label="Number of adjacent seats to find"
        />
        <button
          onClick={findAdjacentSeats}
          disabled={selectedSeats.length >= maxSeats}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label={`Find ${numSeats} adjacent seats`}
        >
          Find
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Searches for consecutive seats in the same row. Adds to current selection.
      </p>
    </div>
  );
}

