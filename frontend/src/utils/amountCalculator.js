// utils/amountCalculator.js
export const calculateTotalAmount = (selectedServices) => {
    if (!Array.isArray(selectedServices)) return 0;
  
    return selectedServices.reduce((total, service) => total + (service.price || 0), 0);
  };
  