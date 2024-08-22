import { useState } from "react";
import Header from "../components/Header";
import Steps from "../components/Steps";
import UploadedVideoList from "../components/UploadedVideoList";
import CompressedVideoList from "../components/CompressedVideoList";

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
          <div className="mb-6">
            <label className="block font-medium mb-2">Upload your video:</label>
            <input
              type="file"
              accept="video/*"
              className="file-input file-input-bordered file-input-primary w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:gap-6">
          <div className="col-span-full lg:col-span-1 shadow-md bg-base-100 rounded-lg p-6 mb-6">
            <UploadedVideoList />
          </div>
          <div className="col-span-full lg:col-span-1 shadow-md bg-base-100 rounded-lg p-6 mb-6">
            <CompressedVideoList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
