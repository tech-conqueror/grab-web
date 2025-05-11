import { Component } from "react";
import CarIcon from "./CarIcon";
import {
  advanceCoord,
  getNextCoordIndex,
  countTurns,
  getRotation,
  getTurnDistance,
} from "./movement";
import { wait } from "../../share/utils";

const fetchInterval: number = 1500;
const refreshInterval: number = 5;
const turnDuration: number = refreshInterval * 8;
const animationOverhead: number = 200;

export interface CarProps {
  carId: string;
  actual: [number, number];
  path: [number, number][];
}

interface CarState {
  position: [number, number];
  rotation: number;
  path: [number, number][];
}

export class Car extends Component<CarProps, CarState> {
  latestUpdateAt: number;
  moveBusy: boolean;
  rotateBusy: boolean;
  intervalId?: NodeJS.Timeout;

  constructor(props: CarProps) {
    super(props);

    const {
      path,
      actual,
    }: { path: [number, number][]; actual: [number, number] } = props;

    let pathIndex: number = path.findIndex(([x, y]: [number, number]) => {
      return x === actual[0] && y === actual[1];
    });
    if (pathIndex === 0) pathIndex = 1;

    const rotation: number = getRotation(path, pathIndex);

    this.latestUpdateAt = 0;
    this.rotateBusy = false;
    this.moveBusy = false;
    this.state = {
      position: actual,
      rotation,
      path,
    };
  }

  async move(
    actual: [number, number],
    path: [number, number][],
    receivedAt: number
  ): Promise<void> {
    while (this.moveBusy) {
      await wait(100);
      if (receivedAt !== this.latestUpdateAt) return;
    }

    this.moveBusy = true;

    const { position } = this.state;
    let [currX, currY] = position;

    const startIndex = getNextCoordIndex(currX, currY, path);
    const endIndex = path.findIndex(
      ([x, y]) => x === actual[0] && y === actual[1]
    );

    const section = path.slice(startIndex, endIndex + 1);
    if (section.length < 2) {
      this.moveBusy = false;
      return;
    }

    const turnCount = countTurns(section);
    const turnsDuration = turnCount * turnDuration;

    const distance = endIndex - startIndex + Math.max(currX % 1, currY % 1);
    const steps =
      (fetchInterval - turnsDuration - animationOverhead) / refreshInterval;
    const increment = distance / steps;

    for (let i = 0; i < section.length; i++) {
      if (i > 0) {
        while (this.rotateBusy) {
          await wait(refreshInterval);
        }
        await this.rotate(section, i);
      }

      const [nextX, nextY] = section[i];
      while (currX !== nextX) {
        currX = advanceCoord(currX, nextX, increment);
        this.setState({ position: [currX, this.state.position[1]], path });
        await wait(refreshInterval);
      }

      while (currY !== nextY) {
        currY = advanceCoord(currY, nextY, increment);
        this.setState({ position: [this.state.position[0], currY], path });
        await wait(refreshInterval);
      }
    }

    this.moveBusy = false;
  }

  async rotate(section: [number, number][], i: number): Promise<void> {
    this.rotateBusy = true;

    let rotation = this.state.rotation;
    const targetRotation = getRotation(section, i);
    if (this.state.rotation === targetRotation) {
      this.rotateBusy = false;
      return;
    }

    const { distClockwise, distCounterclockwise } = getTurnDistance(
      rotation,
      targetRotation
    );
    const isClockwise = distClockwise < distCounterclockwise;

    const diff = Math.min(distClockwise, distCounterclockwise);
    const steps = turnDuration / refreshInterval;
    const increment = diff / steps;

    while (this.state.rotation !== targetRotation) {
      if (isClockwise) rotation += increment;
      else rotation -= increment;

      if (rotation > 360) rotation = 0;
      else if (rotation < 0) rotation = 360 - Math.abs(rotation);

      this.setState({ rotation });
      await wait(refreshInterval);
    }

    this.rotateBusy = false;
  }

  componentDidUpdate(prevProps: {
    actual: [number, number];
    path: [number, number][];
  }): void {
    if (prevProps.actual === this.props.actual) return;

    const receivedAt: number = Date.now();
    this.latestUpdateAt = receivedAt;
    this.move(this.props.actual, this.props.path, receivedAt);
  }

  componentDidMount(): void {
    this.intervalId = setInterval(async () => {
      try {
        const location = this.props.actual;
        const response = await fetch(
          `http://localhost:8080/drivers/${this.props.carId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify([
              {
                op: "replace",
                path: "currentLocation/lat",
                value: location[0],
              },
              {
                op: "replace",
                path: "currentLocation/lng",
                value: location[1],
              },
            ]),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Failed to patch and fetch new location:", error);
      }
    }, 5000);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  render() {
    const gridSize = 500;
    const gridCount = 50; // Number of squares in each direction
    const squareSize = gridSize / gridCount;
    const { position, rotation } = this.state;
    const [x, y] = position;
    return (
      <CarIcon
        x={x * squareSize - 20}
        y={y * squareSize - 20}
        rotation={rotation}
      />
    );
  }
}
