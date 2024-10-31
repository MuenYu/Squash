import { IconSend } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useLoaderData } from "react-router-dom";
import { uploadAndCompress, compressExisting } from "../api/requests";

const SettingForm = () => {
  const { setStep, setTaskId } = useOutletContext();
  const [uploadList] = useState(useLoaderData());
  const navigate = useNavigate();
  const videoFileInput = useRef(null);
  const videoNameInput = useRef(null);

  useEffect(() => {
    setStep(0);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const videoFile = formData.get("videoFile");

    if (videoFile?.size > 0) {
      uploadAndCompress(formData)
      .then((taskId) => {
        setTaskId(taskId);
        navigate("/panel/compressing");
      })
      .catch((err) => {
        alert(err.message);
      });
    }
    else {
      compressExisting(formData)
      .then((taskId) => {
        setTaskId(taskId);
        navigate("/panel/compressing");
      })
      .catch((err) => {
        alert(err.message);
      });
    }
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
            data-tip="You can upload a new video to compress"
          >
            <label className="block font-medium mb-2">Upload your video:</label>
          </div>
          <input
            name="videoFile"
            type="file"
            accept="video/*"
            className="file-input file-input-bordered file-input-primary block"
            ref={videoFileInput}
            onChange={() => {
              videoNameInput.current.value = "";
            }}
          />
        </div>
        <p className="font-medium text-2xl">OR</p>
        <div>
          <div
            className="tooltip"
            data-tip="You can select an uploaded video to compress"
          >
            <label className="block font-medium mb-2">
              Select your uploaded video:
            </label>
          </div>
          <select
            name="videoName"
            className="select select-primary block"
            ref={videoNameInput}
            defaultValue=""
            onChange={() => {
              videoFileInput.current.value = "";
            }}
          >
            <option value="">Select the video you want to compress</option>
            {uploadList
              .map((video, index) => (
                <option key={index} value={video.file_name}>
                  {video.original_name}
                </option>
              ))}
          </select>
        </div>
      </fieldset>
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
      <button className="btn btn-primary">
        <IconSend stroke={2} /> Squash it!
      </button>
    </form>
  );
};

export default SettingForm;
