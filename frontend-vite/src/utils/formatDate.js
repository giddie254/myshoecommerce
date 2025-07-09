// src/utils/formatDate.js

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) return 'Invalid date';

  return date.toLocaleString('en-KE', {
    weekday: 'short',        // e.g. "Sat"
    day: 'numeric',          // e.g. "28"
    month: 'short',          // e.g. "Jun"
    year: 'numeric',         // e.g. "2025"
    hour: 'numeric',         // e.g. "3 PM"
    minute: '2-digit',       // e.g. "03"
    hour12: true             // 12-hour format with AM/PM
  });
};




