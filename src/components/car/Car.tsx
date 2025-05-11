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

const fetchInterval: number = 1000;
const refreshInterval: number = 33;
const turnDuration: number = refreshInterval * 8;
const animationOverhead: number = 200;

interface CarProps {
  actual: [number, number];
  rotation: number;
  path: [number, number][];
}

interface CarState {
  position: [number, number];
  rotation: number;
  path: [number, number][];
}

class Car extends Component<CarProps, CarState> {
  latestUpdateAt: number;
  moveBusy: boolean;
  rotateBusy: boolean;

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

export default Car;
