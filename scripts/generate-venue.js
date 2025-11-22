// Script to generate a large venue.json for testing
// Run with: node scripts/generate-venue.js

const fs = require("fs");
const path = require("path");

function generateVenue() {
  const sections = [];
  const sectionsConfig = [
    { id: "A", label: "Lower Bowl A", x: 50, y: 50, rows: 30, seatsPerRow: 50 },
    { id: "B", label: "Lower Bowl B", x: 400, y: 50, rows: 30, seatsPerRow: 50 },
    { id: "C", label: "Lower Bowl C", x: 750, y: 50, rows: 30, seatsPerRow: 50 },
    { id: "D", label: "Upper Bowl A", x: 50, y: 350, rows: 40, seatsPerRow: 60 },
    { id: "E", label: "Upper Bowl B", x: 450, y: 350, rows: 40, seatsPerRow: 60 },
    { id: "F", label: "Upper Bowl C", x: 850, y: 350, rows: 40, seatsPerRow: 60 },
  ];

  sectionsConfig.forEach((config) => {
    const rows = [];
    for (let rowIndex = 1; rowIndex <= config.rows; rowIndex++) {
      const seats = [];
      for (let col = 1; col <= config.seatsPerRow; col++) {
        const x = config.x + (col - 1) * 20;
        const y = config.y + (rowIndex - 1) * 15;
        
        // Random status distribution
        const rand = Math.random();
        let status = "available";
        if (rand < 0.3) status = "reserved";
        else if (rand < 0.5) status = "sold";
        else if (rand < 0.55) status = "held";
        
        // Price tier based on section and row
        let priceTier = 2;
        if (config.id.startsWith("A") || config.id.startsWith("B") || config.id.startsWith("C")) {
          priceTier = rowIndex <= 10 ? 1 : 2;
        } else {
          priceTier = rowIndex <= 15 ? 3 : 4;
        }

        seats.push({
          id: `${config.id}-${rowIndex}-${String(col).padStart(2, "0")}`,
          col: col,
          x: x,
          y: y,
          priceTier: priceTier,
          status: status,
        });
      }
      rows.push({
        index: rowIndex,
        seats: seats,
      });
    }

    sections.push({
      id: config.id,
      label: config.label,
      transform: { x: 0, y: 0, scale: 1 },
      rows: rows,
    });
  });

  const venue = {
    venueId: "arena-01",
    name: "Metropolis Arena",
    map: { width: 1024, height: 768 },
    sections: sections,
  };

  const totalSeats = sections.reduce(
    (sum, section) =>
      sum +
      section.rows.reduce(
        (rowSum, row) => rowSum + row.seats.length,
        0
      ),
    0
  );

  console.log(`Generated venue with ${totalSeats} seats`);

  const outputPath = path.join(__dirname, "../public/venue.json");
  fs.writeFileSync(outputPath, JSON.stringify(venue, null, 2));
  console.log(`Saved to ${outputPath}`);
}

generateVenue();

