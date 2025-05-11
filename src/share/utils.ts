import paths from "./paths";

type Coordinate = [number, number];

interface Car {
  carId: string;
  path: Coordinate[];
  actual: [number, number];
}

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

const cars: Map<string, Car> = new Map<string, Car>();

export const api: { get: () => Promise<any> } = {
  get: async (): Promise<any> => cars.values(),
};

const cycle = async (pathObj: {
  carId: string;
  i: number;
  selected: "first" | "second";
  first: [number, number][];
  second: [number, number][];
}): Promise<void> => {
  while (true) {
    const { carId, i, selected } = pathObj;
    const path = pathObj[selected];
    const [x, y] = path[i];

    cars.set(carId, { carId, path, actual: [x, y] });

    if (i === path.length - 1) {
      pathObj.selected = selected === "first" ? "second" : "first";
      pathObj.i = 0;
      await wait(3000);
    } else {
      pathObj.i++;
    }

    await wait(200);
  }
};

paths.forEach((path) => cycle(path));

export type { Car };
