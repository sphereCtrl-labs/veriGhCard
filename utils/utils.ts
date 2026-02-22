export const formatCardNumber = (text: string): string => {
  let cleaned = text.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  if (cleaned.startsWith("GHA")) {
    cleaned = cleaned.slice(3);
  }

  cleaned = cleaned.replace(/\D/g, "").slice(0, 10);

  let formatted = "GHA-";
  if (cleaned.length > 0) {
    formatted += cleaned.slice(0, 9);
    if (cleaned.length > 9) {
      formatted += "-" + cleaned.slice(9);
    }
  }

  return formatted;
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const ghaCardRegex = /^GHA-\d{9}-\d$/;
  return ghaCardRegex.test(cardNumber);
};
