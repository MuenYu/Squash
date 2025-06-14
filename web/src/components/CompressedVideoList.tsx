"use client";

import { DateTime } from "luxon";
import { IconDownload } from "@tabler/icons-react";
import { Record as RecordType } from "../../generated/prisma";
import { useEffect, useState } from "react";

const compressionMap: Record<string, string> = {
  "1": "Low",
  "5": "Medium",
  "9": "High",
};

const CompressedVideoList: React.FC<{ list: RecordType[] }> = ({ list }) => {
  const [videoList, setVideoList] = useState<RecordType[]>(list);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/videos");
      if (res.ok) {
        const data = await res.json();
        setVideoList(data);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1 className="font-medium mb-2">Your compressed videos:</h1>
      {videoList.length === 0 ? (
        <h2 className="font-medium mb-2">
          You have no video upload records yet.
        </h2>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Source Video Name</th>
              <th>Compression Finished Time</th>
              <th>Compression Level</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {videoList.map((video, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{video.original_name}</td>
                <td>
                  {typeof video.create_time === "string"
                    ? DateTime.fromISO(video.create_time).toFormat(
                        "yyyy-MM-dd HH:mm"
                      )
                    : DateTime.fromJSDate(video.create_time).toFormat(
                        "yyyy-MM-dd HH:mm"
                      )}
                </td>
                <td>{compressionMap[video.level]}</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-outline btn-primary btn-sm"
                    onClick={() => {
                      window.open(
                        `/api/videos/${video.compressed_name}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    <IconDownload stroke={1} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default CompressedVideoList;
