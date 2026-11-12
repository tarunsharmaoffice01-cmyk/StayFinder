/**
 * Utility functions for calculating booking prices, taxes, and service fees
 */

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '$0';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Math.round(Number(amount)));
};

/**
 * Calculates complete pricing breakdown for a stay
 * @param {number} pricePerNight
 * @param {number} nights
 * @param {number} cleaningFee
 * @returns {object} Pricing breakdown
 */
export const calculateBookingPrice = (pricePerNight = 100, nights = 1, cleaningFee = 50) => {
  const safeNights = Math.max(1, parseInt(nights, 10) || 1);
  const safePrice = Math.max(0, Number(pricePerNight) || 100);
  const safeCleaning = Math.max(0, Number(cleaningFee) || 50);

  const subtotal = safePrice * safeNights;
  const serviceFee = Math.round(subtotal * 0.12); // 12% StayFinder platform service fee
  const occupancyTaxes = Math.round(subtotal * 0.08); // 8% local occupancy tax
  const total = subtotal + safeCleaning + serviceFee + occupancyTaxes;

  return {
    pricePerNight: safePrice,
    nights: safeNights,
    subtotal,
    cleaningFee: safeCleaning,
    serviceFee,
    occupancyTaxes,
    total
  };
};

export default { formatCurrency, calculateBookingPrice };

