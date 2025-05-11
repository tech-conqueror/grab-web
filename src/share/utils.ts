import { Coordinate } from "../components/car/routes";
import paths from "./paths";

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

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

interface Route {
  carId: string;
  path: Coordinate[];
  actual: [number, number];
}

const routes: Map<string, Route> = new Map<string, Route>();

export const api: { get: () => Promise<any> } = {
  get: async (): Promise<any> => routes.values(),
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

    routes.set(carId, { carId, path, actual: [x, y] });

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

export type { Route };
