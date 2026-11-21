/** Match the precision of the saved value, including during count-up animation. */
export function statNumberFormat(value: number): Intl.NumberFormat {
  const fractionDigits = Math.min(6, String(value).split(".")[1]?.length ?? 0);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}
