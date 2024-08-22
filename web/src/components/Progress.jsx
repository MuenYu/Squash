import { useEffect, useState } from "react";

const Progress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        // Ensure progress does not exceed 100%
        if (prevProgress >= 100) {
          clearInterval(interval); // Clear interval if progress is 100%
          return 100;
        }
        return prevProgress + 10;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="radial-progress"
      style={{ "--value": progress, "--size": "12rem", "--thickness": "4px" }}
      role="progressbar"
    >
      <span className="text-6xl">{progress}%</span>
    </div>
  );
};

export default Progress;
