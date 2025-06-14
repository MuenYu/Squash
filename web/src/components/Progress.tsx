"use client"

import { useEffect, useState } from "react";

interface ProgressProps {
  initialValue?: number;
}

const Progress: React.FC<ProgressProps> = ({ initialValue = 0 }) => {
  const [progress, setProgress] = useState<number>(initialValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + 5, 100);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="radial-progress"
      style={{ "--value": progress, "--size": "12rem", "--thickness": "4px" } as React.CSSProperties}
      role="progressbar"
    >
      <span className="text-6xl">{progress}%</span>
    </div>
  );
};

export default Progress;
