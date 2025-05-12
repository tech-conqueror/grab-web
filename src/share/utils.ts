import paths from "./paths";
import { obstacles } from "../components/map/obstacles";

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

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Wait function with proper TypeScript typing
export const wait = (t: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, t));

const cars: Map<string, Car> = new Map<string, Car>();

const coordsToObstacles: Record<string, boolean> = {};
obstacles.forEach(([xStart, xEnd, yStart, yEnd]) => {
  for (let x = xStart; x <= xEnd; x++) {
    for (let y = yStart; y <= yEnd; y++) {
      coordsToObstacles[`${x}:${y}`] = true;
    }
  }
});

const roadNodes: string[] = [];
for (let x = 0; x < 50; x++) {
  for (let y = 0; y < 50; y++) {
    if (
      !coordsToObstacles[`${x}:${y}`] &&
      x !== 0 &&
      x !== 49 &&
      y !== 0 &&
      y !== 49
    ) {
      roadNodes.push(`${x}:${y}`);
    }
  }
}

const gridCount = 50; // Number of squares in each direction
const getDestinationRange = (coord: number): [number, number] =>
  coord < gridCount / 2
    ? [gridCount / 2 + Math.floor(coord / 2), gridCount]
    : [0, gridCount / 2 - Math.floor((gridCount - coord) / 2)];

type Graph = (0 | 1)[][];
const buildGraph = (obstaclesSet: Set<string>, gridCount: number): Graph => {
  const graph: Graph = [];
  for (let y = 0; y < gridCount; y++) {
    graph[y] = [];

    for (let x = 0; x < gridCount; x++) {
      if (obstaclesSet.has(`${x}:${y}`)) graph[y][x] = 0;
      else graph[y][x] = 1;
    }
  }

  return graph;
};

type Obstacle = [number, number, number, number, string?];
type Obstacles = Obstacle[];
export const getObstaclesSet = (obstacles: Obstacles): Set<string> => {
  const obstaclesSet = new Set<string>();
  obstacles.forEach(([xStart, xEnd, yStart, yEnd]) => {
    let x = xStart;
    while (x <= xEnd) {
      let y = yStart;
      while (y <= yEnd) {
        obstaclesSet.add(`${x}:${y}`);
        y += 1;
      }
      x += 1;
    }
  });

  return obstaclesSet;
};
const getGraph = (): Graph => {
  const obstaclesSet = getObstaclesSet(obstacles);
  return buildGraph(obstaclesSet, gridCount);
};

type CoordPair = [number, number];
const getRoadNodes = (): CoordPair[] => {
  const obstaclesSet = getObstaclesSet(obstacles);

  const roadNodes: CoordPair[] = [];
  for (let x = 0; x < gridCount; x++) {
    for (let y = 0; y < gridCount; y++) {
      if (!obstaclesSet.has(`${x}:${y}`)) {
        roadNodes.push([x, y]);
      }
    }
  }

  return roadNodes;
};
const getClosestRoadNode = (
  x: number,
  y: number,
  graph: Graph
): CoordPair | undefined => {
  const isValid = (y: number, x: number) =>
    y > 0 && y < graph.length - 1 && x > 0 && x < graph[y].length - 1;

  if (isValid(y, x) && graph[y][x] === 1) return [x, y];

  const directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];

  let queue = [[y, x]];
  const seen = new Set([`${y}:${x}`]);

  while (queue.length) {
    const nextQueue = [];

    for (let i = 0; i < queue.length; i++) {
      const [y, x] = queue[i];

      for (const [dx, dy] of directions) {
        const nextY = y + dy;
        const nextX = x + dx;

        if (isValid(nextY, nextX) && !seen.has(`${nextY}:${nextX}`)) {
          if (graph[nextY][nextX] === 1) return [nextX, nextY];
          seen.add(`${nextY}:${nextX}`);
          nextQueue.push([nextY, nextX]);
        }
      }
    }
    queue = nextQueue;
  }
};

const generateDestination = (coordPair: CoordPair): CoordPair | undefined => {
  const graph = getGraph();

  const [startX, startY] = coordPair;
  const rangeX = getDestinationRange(startX);
  const rangeY = getDestinationRange(startY);

  const destX = getRandomInt(rangeX[0], rangeX[1]);
  const destY = getRandomInt(rangeY[0], rangeY[1]);

  return getClosestRoadNode(destX, destY, graph);
};

const graph = getGraph();
const createPassenger = (name: string) => {
  const roadNodes: CoordPair[] = getRoadNodes().filter(([x, y]: CoordPair) => {
    return x !== 0 && x !== gridCount - 1 && y !== 0 && y !== gridCount - 1;
  });
  const location = roadNodes[getRandomInt(0, roadNodes.length - 1)];
  const [x, y] = location;

  let [destX, destY] = generateDestination([x, y]) || [-1, -1];
  let destination = getClosestRoadNode(destX, destY, graph);

  return {
    name,
    location,
    destination,
  };
};

export const api: {
  getCars: () => Promise<any>;
  getPassengers: () => Promise<any>;
} = {
  getCars: async (): Promise<any> => cars.values(),
  getPassengers: async (): Promise<any> =>
    ["Michael"].map((name) => createPassenger(name)),
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
