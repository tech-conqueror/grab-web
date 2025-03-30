type Coordinate = [number, number];

interface Step {
  carId: string;
  next: Coordinate;
  path: Coordinate[];
}

const routes: {
  carId: string;
  path: Coordinate[];
  updates: [number, number][];
}[] = [
  {
    carId: "car1",
    path: [
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
    ],
    updates: [
      [8, 17],
      [7, 14],
      [6, 11],
      [6, 7],
      [11, 6],
      [12, 8],
      [12, 14],
      [16, 13],
    ],
  },
  {
    carId: "car2",
    path: [
      [24, 27],
      [24, 28],
      [25, 28],
      [25, 29],
      [25, 30],
      [25, 31],
      [25, 32],
      [25, 33],
      [25, 34],
      [25, 35],
      [25, 36],
      [24, 36],
      [23, 36],
      [22, 36],
      [21, 36],
      [20, 36],
      [19, 36],
      [18, 36],
      [17, 36],
      [16, 36],
      [16, 36],
      [16, 35],
      [16, 34],
      [16, 33],
      [16, 32],
      [15, 32],
      [14, 32],
      [13, 32],
      [12, 32],
      [11, 32],
      [10, 32],
      [9, 32],
    ],
    updates: [
      [24, 27],
      [25, 29],
      [25, 34],
      [22, 36],
      [16, 36],
      [16, 34],
      [15, 32],
      [9, 32],
    ],
  },
  {
    carId: "car3",
    path: [
      [36, 4],
      [37, 4],
      [38, 4],
      [39, 4],
      [39, 5],
      [39, 6],
      [39, 7],
      [39, 8],
      [39, 9],
      [39, 10],
      [39, 11],
      [39, 12],
      [39, 13],
      [39, 14],
      [39, 15],
      [39, 16],
      [39, 17],
      [39, 18],
      [39, 19],
      [39, 20],
      [39, 21],
      [39, 22],
      [39, 23],
      [39, 24],
      [39, 25],
      [39, 26],
      [39, 27],
      [39, 28],
      [39, 29],
      [39, 30],
      [39, 31],
      [38, 31],
      [37, 31],
      [36, 31],
      [35, 31],
      [34, 31],
      [33, 31],
      [32, 31],
      [31, 31],
      [30, 31],
      [29, 31],
      [28, 31],
    ],
    updates: [
      [36, 4],
      [39, 6],
      [39, 12],
      [39, 21],
      [39, 27],
      [38, 31],
      [35, 31],
      [28, 31],
    ],
  },
];

export default routes;
