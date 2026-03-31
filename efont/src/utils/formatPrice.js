// Primary NPR formatter — returns "रू 1,500" style
export const formatNPR = (price) => {
    if (price === null || price === undefined) return "रू 0";
    const formatted = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
    return `रू ${formatted}`;
};

// Backward-compat alias — Cart.jsx / ItemContent.jsx import this name
export const formatPrice = formatNPR;

// Returns the raw calculated value (used where the caller formats separately)
export const formatPriceCalculation = (quantity, price) => {
    return (Number(quantity) * Number(price)).toFixed(2);
};

// Abbreviated revenue display for dashboard cards (K / M / B)
export const formatRevenue = (value) => {
    if (value >= 1e9) return (value / 1e9).toFixed(1) + "B";
    if (value >= 1e6) return (value / 1e6).toFixed(1) + "M";
    if (value >= 1e3) return (value / 1e3).toFixed(1) + "K";
    return value;
};