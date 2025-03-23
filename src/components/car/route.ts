type Coordinate = [number, number];

const path: Coordinate[] = [
  [8, 17],
  [8, 16],
  [8, 15],
  [8, 14],
  [7, 14],
  [6, 14],
  [6, 13],
  [6, 12],
  [6, 11],
  [6, 10],
  [6, 9],
  [6, 8],
  [6, 7],
  [6, 6],
  [7, 6],
  [8, 6],
  [9, 6],
  [10, 6],
  [11, 6],
  [12, 6],
  [12, 7],
  [12, 8],
  [12, 9],
  [12, 10],
  [12, 11],
  [12, 12],
  [12, 13],
  [12, 14],
  [13, 14],
  [14, 14],
  [15, 14],
  [16, 14],
  [16, 13],
];

interface Step {
  carId: string;
  next: Coordinate;
  path: Coordinate[];
}

const route: Step[] = [
  {
    carId: "car1",
    next: [8, 17],
    path,
  },
  {
    carId: "car1",
    next: [7, 14],
    path,
  },
  {
    carId: "car1",
    next: [6, 7],
    path,
  },
  {
    carId: "car1",
    next: [11, 6],
    path,
  },
  {
    carId: "car1",
    next: [12, 11],
    path,
  },
  {
    carId: "car1",
    next: [16, 13],
    path,
  },
];

export default route;
