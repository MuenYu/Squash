import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
// import { fetchProgress } from "../api/requests";

const Progress = () => {
  const [progress, setProgress] = useState(0);
  const { setStep, taskId } = useOutletContext();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!taskId) navigate("/panel");
  //   setStep(1);
  //   const interval = setInterval(() => {
  //     fetchProgress(taskId)
  //       .then((p) => {
  //         setProgress(p);
  //         if (p >= 100) {
  //           clearInterval(interval);
  //           setTimeout(() => {
  //             navigate("/panel/complete");
  //           }, 1000);
  //         }
  //       })
  //       .catch((err) => {
  //         alert(err.message);
  //         navigate("/panel");
  //       });
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    navigate("/panel");
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
