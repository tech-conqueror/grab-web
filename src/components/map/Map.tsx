import { Component } from "react";
import obstaclesData from "./obstacles";
import Obstacle from "./Obstacle";
import Car from "../car/Car";
import { wait } from "../../share/utils";
import route from "../car/route";

interface CarData {
  carId: string;
  next: [number, number];
  rotation?: number;
  path: [number, number][];
}

interface MapState {
  cars: CarData[];
}

const fetchInterval: number = 1000;

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
    for (const record of route) {
      this.setState({ cars: [record] });
      await wait(fetchInterval);
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
      ({ carId, next, rotation = 270, path }) => (
        <Car key={carId} next={next} rotation={rotation} path={path} />
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
