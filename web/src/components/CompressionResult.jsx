import { useEffect } from "react";
import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";

const CompressionResult = () => {
  const { setStep, taskId, setTaskId, setVideoList } = useOutletContext();
  const videoList = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    setVideoList(videoList);
    if (!taskId) navigate("/panel");
    setStep(2);
  }, []);
  const handleReset = () => {
    setTaskId(null);
    navigate("/panel");
  };

  return (
    <>
      <h1 className="font-medium text-2xl mb-6">
        Compression complete! The video is ready in the compressed video list
        below
      </h1>
      <button className="btn btn-primary" onClick={handleReset}>
        Try another one?
      </button>
    </>
  );
};

export default CompressionResult;
