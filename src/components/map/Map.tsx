import { Component } from "react";
import obstaclesData from "./obstacles";
import Obstacle from "./Obstacle";
import Car from "../car/Car";
import { api, getRandomInt, Route, wait } from "../../share/utils";
import routes from "../car/routes";

interface CarData {
  carId: string;
  actual: [number, number];
  rotation?: number;
  path: [number, number][];
}

interface MapState {
  cars: CarData[];
  refreshing: boolean;
}

const fetchInterval: number = 1500;

/**
 * Generates a map of coordinates to obstacle colors.
 */
type CoordsMap = Record<string, string>;
const generateObstacleMap = (obstacles: any[]): CoordsMap => {
  const defaultColor = "#A2A3A2";
  const coordsToObstacles: CoordsMap = {};
  obstacles.forEach(([xStart, xEnd, yStart, yEnd, color]) => {
    for (let x = xStart; x <= xEnd; x++) {
      for (let y = yStart; y <= yEnd; y++) {
        coordsToObstacles[`${x}:${y}`] = color || defaultColor;
      }
    }
  });
  return coordsToObstacles;
};

class Map extends Component<{}, MapState> {
  previousUpdateAt: number;

  constructor(props: {}) {
    super(props);
    this.previousUpdateAt = Date.now();
    this.state = {
      cars: [],
      refreshing: false,
    };
  }

  async simulate(): Promise<void> {
    const updateCount: number = routes[0].updates.length;

    for (let i = 0; i < updateCount; i++) {
      const cars: CarData[] = [];

      for (let j = 0; j < routes.length; j++) {
        const update = {
          carId: routes[j].carId,
          path: routes[j].path,
          actual: routes[j].updates[i],
        };
        cars.push(update);
      }

      this.setState({ cars });
      const interval: number = getRandomInt(500, 1000);
      await wait(interval);
    }
  }

  async loadData(): Promise<void> {
    while (true) {
      const routes: Route[] = await api.get();

      const timeout = 2000;
      const now = Date.now();
      if (now - this.previousUpdateAt > timeout) {
        this.previousUpdateAt = now;
        this.setState({ cars: [], refreshing: true });
        await wait(fetchInterval);
        continue;
      }

      this.previousUpdateAt = now;

      const cars: CarData[] = [];
      for (const ride of routes) {
        const { carId, actual, path } = ride;
        cars.push({
          carId: carId,
          path: path,
          actual: actual,
        });
      }

      this.setState({ cars, refreshing: false });
      await wait(fetchInterval);
    }
  }

  componentDidMount(): void {
    this.loadData();
  }

  render() {
    const gridSize = 500;
    const gridCount = 50; // Number of squares in each direction
    const squareSize = gridSize / gridCount;

    const obstacleMap = generateObstacleMap(obstaclesData);
    const obstacleElems = Object.entries(obstacleMap).map(([key, color]) => {
      const [x, y] = key.split(":").map(Number);
      return (
        <Obstacle
          key={key}
          x={x * squareSize}
          y={y * squareSize}
          width={squareSize}
          height={squareSize}
          color={color}
        />
      );
    });

    const cars = this.state.cars.map(
      ({ carId, actual, rotation = 270, path }) => (
        <Car key={carId} actual={actual} rotation={rotation} path={path} />
      )
    );

    return (
      <svg width={gridSize} height={gridSize} className="map">
        {obstacleElems}
        {cars}
      </svg>
    );
  }
}

export default Map;
