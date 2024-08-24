const CompressionResult = ({ setStep, setTaskId }) => {
  const handleReset = () => {
    setStep(0);
    setTaskId(null);
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
