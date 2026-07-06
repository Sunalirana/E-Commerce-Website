// Currency formatting utility for Indian Rupees
export const formatCurrency = (amount) => {
  // Convert amount to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Format with Indian number system (lakhs, crores)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numAmount);
};

// Format currency without symbol (just the number)
export const formatCurrencyNumber = (amount) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numAmount);
};

// Convert price to display format (divide by 100 if needed)
export const formatPrice = (price) => {
  return formatCurrency(price);
};

// Format price for display in cards and lists
export const formatDisplayPrice = (price) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (numPrice >= 100000) {
    return `₹${(numPrice / 100000).toFixed(1)}L`;
  } else if (numPrice >= 1000) {
    return `₹${(numPrice / 1000).toFixed(1)}K`;
  } else {
    return `₹${numPrice.toLocaleString('en-IN')}`;
  }
};
