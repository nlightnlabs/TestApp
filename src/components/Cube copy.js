import React, { useState, useEffect } from 'react';

const Cube = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(rotation => rotation + 1);
    }, 20);

    return () => clearInterval(interval);
  });

  return (
    <div className="cube-container">
      <svg width="200" height="200" viewBox="-100 -100 200 200">
        <g transform={`rotate(${rotation} 0 0)`}>
         <polygon points="-50,-10 20,-10 50,50 -50,50" fill="gray" />
          <polygon points="-50,-50 50,-50 50,50 -50,50" fill="blue" />
          <polygon points="50,-50 50,50 0,100 0,0" fill="green" />
          <polygon points="-50,-50 0,0 0,100 -50,50" fill="red" />
        </g>
      </svg>
    </div>
  );
};

export default Cube;



