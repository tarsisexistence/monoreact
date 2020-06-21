export const capitalize = (str: string): string => {
  const firstChar = str[0].toUpperCase();
  const rest = str.slice(1).toLowerCase();
  return firstChar + rest;
};
