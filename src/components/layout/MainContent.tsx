"use client";

import type { Venue } from "@/types/venue";
import SeatingMapSection from "../seating/SeatingMapSection";
import Sidebar from "../features/Sidebar";

interface MainContentProps {
  venue: Venue;
}

export default function MainContent({ venue }: MainContentProps) {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3">
          <SeatingMapSection venue={venue} />
        </div>
        <Sidebar venue={venue} />
      </div>
    </main>
  );
}
