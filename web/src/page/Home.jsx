import { useEffect, useState } from "react";
import Header from "../components/Header";
import Steps from "../components/Steps";
import CompressedVideoList from "../components/CompressedVideoList";
import SettingForm from "../components/SettingForm";
import Progress from "../components/Progress";
import CompressionResult from "../components/CompressionResult";

const HomePage = () => {
  const [step, setStep] = useState(0);
  const [taskId, setTaskId] = useState(null);

  return (
    <div className="min-h-screen bg-base-200">
      <Header />

      <main className="p-4">
        <div className="shadow-md bg-base-100 rounded-lg p-6 mb-6">
          <div className="flex justify-center mb-6">
            <Steps step={step} />
          </div>
          {/* File Upload Area */}
          <div className="mb-6 flex flex-col items-center">
            {step === 0 && (
              <SettingForm setStep={setStep} setTaskId={setTaskId} />
            )}
            {step === 1 && <Progress taskId={taskId} setStep={setStep} />}
            {step >= 2 && (
              <CompressionResult setStep={setStep} setTaskId={setTaskId} />
            )}
          </div>
        </div>

        <div className="shadow-md bg-base-100 rounded-lg p-6 mb-6 overflow-x-auto">
          <CompressedVideoList />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
