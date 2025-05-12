import { Component } from "react";
import ObstacleComponent from "./Obstacle";
import {
  Passenger as PassengerComponent,
  PassengerProps,
} from "../passenger/Passenger";
import DestinationIconComponent from "../passenger/DestinationIcon";
import { Car as CarComponent, CarProps } from "../car/Car";
import { api, Car, wait } from "../../share/utils";
import { Obstacle, obstacles } from "./obstacles";

const fetchInterval: number = 1500;

interface MapState {
  passengers: PassengerProps[];
  cars: CarProps[];
  refreshing: boolean;
}

class Map extends Component<{}, MapState> {
  previousUpdateAt: number;

  constructor(props: {}) {
    super(props);

    this.previousUpdateAt = Date.now();
    this.state = {
      passengers: [],
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

    const passengerComponents = this.state.passengers.map(
      ({ name, location, destination }) => (
        <PassengerComponent
          key={name}
          name={name}
          location={location}
          destination={destination}
        />
      )
    );

    const destinationIconComponents = this.state.passengers.map(
      ({ destination }) => {
        const [x, y] = destination;

        return (
          <DestinationIconComponent
            key={`${x}:${y}`}
            x={x * squareSize - squareSize / +5}
            y={y * squareSize - squareSize / 2 - 8}
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
    const actualComponents = this.state.cars.map(({ carId, actual }) => {
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
            {passengerComponents}
            {destinationIconComponents}
            {actualComponents}
            {carComponents}
          </svg>
        </div>
      </div>
    );
  }

  componentDidMount(): void {
    this.loadPassengers();
    this.stimulate();
  }

  async loadPassengers() {
    const passengers = await api.getPassengers();
    this.setState({ passengers });
    await wait(fetchInterval);
  }

  async stimulate(): Promise<void> {
    while (true) {
      const cars: Car[] = await api.getCars();

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
