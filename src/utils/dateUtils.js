/**
 * Date calculation and formatting utilities for StayFinder
 */

/**
 * Calculates number of nights between checkIn and checkOut date strings (YYYY-MM-DD)
 */
export const calculateNights = (checkInDateStr, checkOutDateStr) => {
  if (!checkInDateStr || !checkOutDateStr) return 1;

  const start = new Date(checkInDateStr);
  const end = new Date(checkOutDateStr);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 1;
};

/**
 * Returns a standard formatted date string (e.g., 'Oct 15, 2026')
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Returns default check-in (tomorrow) and check-out (3 days after) in YYYY-MM-DD
 */
export const getDefaultDates = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 4);

  const toIsoDate = (d) => d.toISOString().split('T')[0];

  return {
    checkIn: toIsoDate(tomorrow),
    checkOut: toIsoDate(threeDaysLater)
  };
};

/**
 * Returns today's date in YYYY-MM-DD for min date in datepickers
 */
export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export default { calculateNights, formatDate, getDefaultDates, getTodayString };

