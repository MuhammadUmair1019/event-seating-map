# Components Structure

This directory follows a scalable, domain-driven folder structure for better organization and maintainability.

## Folder Organization

```
components/
├── layout/          # Layout components (Header, Footer, MainContent)
├── seating/         # Seating map related components
├── features/        # Feature-specific components
├── common/          # Shared/common components (Loading, Error states)
└── index.ts         # Central export file
```

## Directory Descriptions

### `layout/`
Layout components that define the overall page structure:
- **Header.tsx** - Page header with venue name
- **Footer.tsx** - Page footer with instructions
- **MainContent.tsx** - Main content area wrapper

### `seating/`
Core seating map components:
- **SeatingMapSection.tsx** - Main map container with controls and legend
- **SeatingMapCanvas.tsx** - Canvas-based map renderer (performance optimized)
- **Seat.tsx** - Individual seat component (for SVG version)
- **Legend.tsx** - Dynamic legend (heat map vs status mode)

### `features/`
Feature-specific components:
- **Controls.tsx** - UI controls (dark mode, heat map, reset view)
- **SeatDetails.tsx** - Seat information display
- **SelectionSummary.tsx** - Selected seats summary with subtotal
- **FindAdjacentSeats.tsx** - Helper to find consecutive seats
- **Sidebar.tsx** - Sidebar container component

### `common/`
Reusable shared components:
- **LoadingState.tsx** - Loading spinner component
- **ErrorState.tsx** - Error message component

## Usage

### Import from index (Recommended)
```tsx
import { Header, Footer, SeatingMapSection } from "@/components";
```

### Direct import (Also supported)
```tsx
import Header from "@/components/layout/Header";
```

## Adding New Components

1. **Layout components** → `layout/`
2. **Seating-related** → `seating/`
3. **Feature-specific** → `features/`
4. **Shared/common** → `common/`
5. **Update** `index.ts` with new exports

## Benefits

- ✅ Clear separation of concerns
- ✅ Easy to locate components
- ✅ Scalable for future growth
- ✅ Better code organization
- ✅ Easier maintenance and testing

