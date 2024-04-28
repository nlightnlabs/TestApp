import React from 'react';

const Svg = ({ src, width, height, fill, opacity }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      opacity={opacity}
    >
      <path d={src} />
    </svg>
  );
};

export default Svg