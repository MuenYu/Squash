import { useEffect, useState } from "react";
import { progressLoader } from "../api/loader";
import { useNavigate, useOutletContext } from "react-router-dom";

const Progress = () => {
  const [progress, setProgress] = useState(0);
  const { setStep, taskId } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!taskId) navigate("/panel");
    setStep(1);
    const interval = setInterval(async () => {
      try {
        const p = await progressLoader(taskId);
        if (p >= 100) {
          setStep(2);
        }
      } catch (err) {
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
