import Steps from "@/components/Steps";
import { IconSend } from "@tabler/icons-react";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Compression Setting",
  description: "Video compression setting.",
};

const SettingForm: React.FC = () => {
  return (
    <>
      <div className="flex justify-center mb-6">
        <Steps step={0} />
      </div>
      {/* File Upload Area */}
      <div className="mb-6 flex flex-col items-center">
        <form
          method="post"
          encType="multipart/form-data"
          className="flex flex-col items-center gap-6"
        >
          <fieldset className="flex gap-6 flex-col lg:flex-row items-center">
            <div>
              <div
                className="tooltip"
                data-tip="You can upload a new video to compress"
              >
                <label className="block font-medium mb-2">
                  Upload your video:
                </label>
              </div>
              <input
                name="videoFile"
                type="file"
                accept="video/*"
                className="file-input file-input-bordered file-input-primary block"
              />
            </div>
            <div>
              <div
                className="tooltip"
                data-tip="Higher compression level, smaller file size, lower quality"
              >
                <label className="block font-medium mb-2">
                  Compression Level:
                </label>
              </div>
              <input
                name="level"
                type="range"
                min={28}
                max={48}
                className="range range-primary"
                step={10}
              />
              <div className="flex w-full justify-between px-2 text-xs">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </fieldset>

          <button className="btn btn-primary">
            <IconSend stroke={2} /> Squash it!
          </button>
        </form>
      </div>
    </>
  );
};

export default SettingForm;
