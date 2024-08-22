import { useState } from "react";
import Header from "../components/Header";
import Steps from "../components/Steps";
import UploadedVideoList from "../components/UploadedVideoList";
import CompressedVideoList from "../components/CompressedVideoList";
import SettingForm from "../components/SettingForm";

const HomePage = () => {
  const [step, setStep] = useState(0);

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
            <SettingForm />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:gap-6">
          <div className="col-span-full lg:col-span-1 shadow-md bg-base-100 rounded-lg p-6 mb-6 overflow-x-auto">
            <UploadedVideoList />
          </div>
          <div className="col-span-full lg:col-span-1 shadow-md bg-base-100 rounded-lg p-6 mb-6 overflow-x-auto">
            <CompressedVideoList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
