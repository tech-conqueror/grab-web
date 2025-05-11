import React from "react";

type ObstacleProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

/**
 * Component representing an individual obstacle.
 */
const Obstacle: React.FC<ObstacleProps> = ({
  x,
  y,
  width,
  height,
  color,
}: ObstacleProps) => {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={color}
      stroke={color}
    />
  );
};

export default Obstacle;
