import Progress from "@/components/Progress";
import Steps from "@/components/Steps";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Video Compressing",
  description: "Video is compressing.",
};

const SettingForm: React.FC = () => {
  return (
    <>
      <div className="flex justify-center mb-6">
        <Steps step={1} />
      </div>
      <div className="mb-6 flex flex-col items-center">
        <Progress />
      </div>
    </>
  );
};

export default SettingForm;
