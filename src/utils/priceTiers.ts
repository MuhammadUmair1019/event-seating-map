// Price tier configuration
// In a real app, this would come from the API
export const PRICE_TIERS: Record<number, { price: number; label: string }> = {
  1: { price: 50, label: "Premium" },
  2: { price: 35, label: "Standard" },
  3: { price: 25, label: "Economy" },
  4: { price: 15, label: "Budget" },
};

export const getPrice = (tier: number): number => {
  return PRICE_TIERS[tier]?.price ?? 0;
};

export const getPriceLabel = (tier: number): string => {
  return PRICE_TIERS[tier]?.label ?? `Tier ${tier}`;
};

// Heat map colors based on price tier
export const getHeatMapColor = (tier: number): string => {
  const colors: Record<number, string> = {
    1: "#ef4444", // red-500
    2: "#f97316", // orange-500
    3: "#eab308", // yellow-500
    4: "#22c55e", // green-500
  };
  return colors[tier] ?? "#6b7280";
};

