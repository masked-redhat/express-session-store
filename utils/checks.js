export const isNumber = (value) => typeof value === "number" && value !== NaN;

export const isValidJsonObject = (value) => {
  try {
    JSON.stringify(value);
    return true;
  } catch {}
  return false;
};
