"use client";

import type { Venue } from "@/types/venue";
import SeatDetails from "./SeatDetails";
import SelectionSummary from "./SelectionSummary";
import FindAdjacentSeats from "./FindAdjacentSeats";

interface SidebarProps {
  venue: Venue;
}

export default function Sidebar({ venue }: SidebarProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <SeatDetails />
      <SelectionSummary />
      <FindAdjacentSeats venue={venue} />
    </div>
  );
}

