import { useEffect, useState } from "react";
import { progressLoader } from "../api/loader";

const Progress = ({ taskId, setStep }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const p = await progressLoader(taskId)
        if (p >= 100) {
          setStep(2);
        }
      } catch(err) {
        clearInterval(interval);
        alert(err.message);
        setStep(0);
      }
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
