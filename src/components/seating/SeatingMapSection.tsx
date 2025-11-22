"use client";

import type { Venue } from "@/types/venue";
import SeatingMapCanvas from "./SeatingMapCanvas";
import Controls from "../features/Controls";
import Legend from "./Legend";

interface SeatingMapSectionProps {
  venue: Venue;
}

export default function SeatingMapSection({ venue }: SeatingMapSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="mb-4">
        <Controls />
      </div>
      <div className="relative" style={{ height: "600px" }}>
        <SeatingMapCanvas venue={venue} />
      </div>
      <div className="mt-4">
        <Legend />
      </div>
    </div>
  );
}
