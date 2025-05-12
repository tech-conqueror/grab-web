import { Component } from "react";
import PassengerIcon from "./PassengerIcon";

export interface PassengerProps {
  name: string;
  location: [number, number];
  destination: [number, number];
}

interface PassengerState {
  name: string;
  location: [number, number];
}

export class Passenger extends Component<PassengerProps, PassengerState> {
  constructor(props: PassengerProps) {
    super(props);

    this.state = {
      name: props.name,
      location: props.location,
    };
  }

  render() {
    const gridSize = 500;
    const gridCount = 50;
    const squareSize = gridSize / gridCount;

    const [x, y] = this.state.location;

    return (
      <PassengerIcon
        x={x * squareSize - squareSize / 2}
        y={y * squareSize - squareSize / 2}
      />
    );
  }
}
