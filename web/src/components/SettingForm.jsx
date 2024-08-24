import { IconSend } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { initCompressionTask } from "../api/requests";

const SettingForm = () => {
  const { setStep, setTaskId } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    setStep(0);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    initCompressionTask(formData)
      .then((taskId) => {
        setTaskId(taskId);
        navigate("/panel/compressing");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <form
      method="post"
      encType="multipart/form-data"
      className="flex flex-col items-center gap-6"
      onSubmit={onSubmit}
    >
      <fieldset className="flex gap-6 flex-col lg:flex-row items-center">
        <div>
          <div
            className="tooltip"
            data-tip="You can upload a new video or select an uploaded video from the list below"
          >
            <label className="block font-medium mb-2">
              Upload/Select your video:
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
            <label className="block font-medium mb-2">Compression Level:</label>
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
  );
};

export default SettingForm;
