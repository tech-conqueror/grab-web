import { Component } from "react";
import obstaclesData from "./obstacles";
import Obstacle from "./Obstacle";
import Car from "../car/Car";
import { getRandomInt, wait } from "../../share/utils";
import routes from "../car/routes";

interface CarData {
  carId: string;
  actual: [number, number];
  rotation?: number;
  path: [number, number][];
}

interface MapState {
  cars: CarData[];
}

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
  constructor(props: {}) {
    super(props);
    this.state = { cars: [] };
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

  componentDidMount(): void {
    this.simulate();
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
