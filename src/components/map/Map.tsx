import { Component } from "react";
import ObstacleComponent from "./Obstacle";
import { Car as CarComponent, CarProps } from "../car/Car";
import { api, Car, wait } from "../../share/utils";
import { Obstacle, obstacles } from "./obstacles";

interface MapState {
  cars: CarProps[];
  refreshing: boolean;
}
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

  render() {
    const gridSize = 500;
    const gridCount = 50; // Number of squares in each direction
    const squareSize = gridSize / gridCount;

    /**
     * Generates a map of coordinates to obstacle colors.
     */
    const generateObstacleMap = (
      obstacles: Obstacle[]
    ): Record<string, string> => {
      const coordsToObstacles: Record<string, string> = {};
      const defaultColor = "#A2A3A2";

      obstacles.forEach(([xStart, xEnd, yStart, yEnd, color]) => {
        for (let x = xStart; x <= xEnd; x++) {
          for (let y = yStart; y <= yEnd; y++) {
            coordsToObstacles[`${x}:${y}`] = color || defaultColor;
          }
        }
      });

      return coordsToObstacles;
    };

    const obstacleMap = generateObstacleMap(obstacles);
    const obstacleComponents = Object.entries(obstacleMap).map(
      ([key, color]) => {
        const [x, y] = key.split(":").map(Number);
        return (
          <ObstacleComponent
            key={key}
            x={x * squareSize}
            y={y * squareSize}
            width={squareSize}
            height={squareSize}
            color={color}
          />
        );
      }
    );

    const carComponents = this.state.cars.map(({ carId, actual, path }) => (
      <CarComponent key={carId} carId={carId} actual={actual} path={path} />
    ));

    const actualsColors: Record<string, string> = {
      "1": "#10b981",
      "2": "#6366f1",
      "3": "#f43f5e",
    };
    const actuals = this.state.cars.map(({ carId, actual }) => {
      return (
        <circle
          key={`${actual[0]}:${actual[1]}`}
          r={squareSize / 2}
          cx={actual[0] * squareSize + squareSize / 2}
          cy={actual[1] * squareSize + squareSize / 2}
          fill={actualsColors[carId]}
        />
      );
    });

    return (
      <div className="map">
        <div className="map-inner">
          <div
            className={`map-refresh ${this.state.refreshing ? "active" : ""}`}
          />
          <svg width={gridSize} height={gridSize} className="map">
            {obstacleComponents}
            {actuals}
            {carComponents}
          </svg>
        </div>
      </div>
    );
  }

  componentDidMount(): void {
    this.stimulate();
  }

  async stimulate(): Promise<void> {
    const fetchInterval: number = 1500;

    while (true) {
      const cars: Car[] = await api.get();

      const timeout = 2000;
      const now = Date.now();
      if (now - this.previousUpdateAt > timeout) {
        this.previousUpdateAt = now;
        this.setState({ cars: [], refreshing: true });
        await wait(fetchInterval);
        continue;
      }

      this.previousUpdateAt = now;

      const carProps: CarProps[] = [];
      for (const car of cars) {
        carProps.push(car);
      }

      this.setState({ cars: carProps, refreshing: false });
      await wait(fetchInterval);
    }
  }
}

export default Map;
