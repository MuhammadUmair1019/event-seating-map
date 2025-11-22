export type SeatStatus = "available" | "reserved" | "sold" | "held";

export interface Seat {
  id: string;
  col: number;
  x: number;
  y: number;
  priceTier: number;
  status: SeatStatus;
}

export interface Row {
  index: number;
  seats: Seat[];
}

export interface Section {
  id: string;
  label: string;
  transform: {
    x: number;
    y: number;
    scale: number;
  };
  rows: Row[];
}

export interface Venue {
  venueId: string;
  name: string;
  map: {
    width: number;
    height: number;
  };
  sections: Section[];
}

export interface SeatWithDetails extends Seat {
  sectionId: string;
  sectionLabel: string;
  rowIndex: number;
}

