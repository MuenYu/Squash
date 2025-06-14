import Steps from "@/components/Steps";
import { minioClient } from "@/lib/minio";
import { IconSend } from "@tabler/icons-react";
import Mime from "mime";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import { auth } from "@/auth";
import { queue, Task } from "@/lib/queue";
import { cache } from "@/lib/redis";

export const metadata: Metadata = {
  title: "Compression Setting",
  description: "Video compression setting.",
};

async function createCompressionTask(formData: FormData) {
  "use server";

  const session = await auth();
  const user = session!.user!.email as string;
  const videoFile = formData.get("videoFile") as File;
  const id = crypto.randomUUID();
  const level = formData.get("level") as string;
  const suffix = Mime.getExtension(videoFile.type);

  // save file to minio
  const objectName = `${id}.${suffix}`;
  const binary = await videoFile.arrayBuffer();
  await minioClient.putObject("origin", objectName, Buffer.from(binary));

  // add a task into queue
  const task: Task = {
    originalName: videoFile.name,
    fileName: objectName,
    level: Number(level),
    owner: user,
  };
  await queue.add(id, task);
  await cache.set(id, 0);

  // redirect to progress page
  redirect(`/panel/compressing/${id}`);
}

const SettingForm: React.FC = () => {
  return (
    <>
      <div className="flex justify-center mb-6">
        <Steps step={0} />
      </div>
      <div className="mb-6 flex flex-col items-center">
        <form
          action={createCompressionTask}
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
                required
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
                min={1}
                max={9}
                className="range range-primary"
                step={4}
                required
              />
              <div className="flex w-full justify-between px-2 text-xs">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </fieldset>

          <button className="btn btn-primary" type="submit">
            <IconSend stroke={2} /> Squash it!
          </button>
        </form>
      </div>
    </>
  );
};

export default SettingForm;
