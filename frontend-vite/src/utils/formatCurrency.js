// src/utils/formatCurrency.js

export const formatCurrency = (amount) => {
  if (isNaN(amount)) return 'KSh 0.00';
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

