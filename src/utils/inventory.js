// Inventory helper utilities

/**
 * Returns the stock status of an inventory item.
 * @param {number} quantity
 * @param {number} minRequired
 * @returns {"ok" | "low" | "critical"}
 */
export const getStockStatus = (quantity, minRequired) => {
  if (quantity === 0) return "critical";
  if (quantity < minRequired) return "low";
  return "ok";
};

/**
 * Returns label and color info for a stock status.
 */
export const stockStatusMeta = {
  ok: { label: "In Stock", color: "text-green-700 bg-green-50 border-green-200" },
  low: { label: "Low Stock", color: "text-amber-700 bg-amber-50 border-amber-200" },
  critical: { label: "Out of Stock", color: "text-red-700 bg-red-50 border-red-200" },
};

/**
 * Returns label and color info for a room status.
 */
export const roomStatusMeta = {
  available: { label: "Available", color: "text-green-700 bg-green-50 border-green-200" },
  occupied: { label: "Occupied", color: "text-blue-700 bg-blue-50 border-blue-200" },
  maintenance: { label: "Maintenance", color: "text-amber-700 bg-amber-50 border-amber-200" },
};

/**
 * Groups an array of items by a given key.
 */
export const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
};
