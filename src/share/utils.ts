// Extending Number prototype with a 'round' method
declare global {
  interface Number {
    round(places: number): number;
  }
}

Number.prototype.round = function (places: number): number {
  return Number(Math.round(Number(`${this}e+${places}`)) + `e-${places}`);
};

// Wait function with proper TypeScript typing
export const wait = (t: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, t));
