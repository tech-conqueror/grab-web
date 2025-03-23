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

interface CarProps {
  next: [number, number];
  rotation: number;
  path: [number, number][];
}

interface CarState {
  position: [number, number];
  rotation: number;
  path: [number, number][];
}

class Car extends Component<CarProps, CarState> {
  rotateBusy: boolean;

  constructor(props: CarProps) {
    super(props);
    this.rotateBusy = false;
    this.state = {
      position: props.next,
      rotation: getRotation(props.path, 1),
      path: props.path,
    };
  }

  async move(next: [number, number]): Promise<void> {
    if (next !== this.props.next) return;

    const { path, position } = this.state;
    let [currX, currY] = position;

    const startIndex = getNextCoordIndex(currX, currY, path);
    const endIndex = path.findIndex(([x, y]) => x === next[0] && y === next[1]);

    const section = path.slice(startIndex, endIndex + 1);
    const turnCount = countTurns(section);
    const turnsDuration = turnCount * turnDuration;

    const distance = endIndex - startIndex + Math.max(currX % 1, currY % 1);
    const steps = (fetchInterval - turnsDuration) / refreshInterval;
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
        if (next !== this.props.next) return;

        currX = advanceCoord(currX, nextX, increment);
        this.setState({ position: [currX, this.state.position[1]] });
        await wait(refreshInterval);
      }

      while (currY !== nextY) {
        if (next !== this.props.next) return;

        currY = advanceCoord(currY, nextY, increment);
        this.setState({ position: [this.state.position[0], currY] });
        await wait(refreshInterval);
      }
    }
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

  componentDidUpdate(prevProps: Readonly<{ next: [number, number] }>): void {
    if (prevProps.next === this.props.next) return;
    this.move(this.props.next);
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
