import { DateTime } from "luxon";
import { videoDownload } from "../api/requests";
import { IconDownload, IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";
// import DetailModal from "./DetailModal";

const CompressedVideoList = ({ videoList }) => {
  const id = "detail-modal"
  const [fileName, setfileName] = useState(null);

  const download = (fileName) => {
    videoDownload(fileName)
      .then((url) => {
        window.open(url, '_blank');
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const compressionMap = new Map();
  compressionMap.set('28', 'Low')
  compressionMap.set('38', 'Medium')
  compressionMap.set('48', 'High')

  return (
    <>
      <h1 className="font-medium mb-2">Your compressed videos:</h1>
      {!videoList || videoList.length === 0 ? (
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
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {videoList
              .filter((item) => !!item.compression_level)
              .map((video, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{video.original_name}</td>
                  <td>
                    {new DateTime(video.create_time).toFormat(
                      "yyyy-MM-dd HH:mm"
                    )}
                  </td>
                  <td>{compressionMap.get(video.compression_level)}
                  </td>
                  <td className="flex gap-2">
                    {/* <button
                      className="btn btn-outline btn-primary btn-sm"
                      onClick={() => {
                        setfileName(video.file_name)
                        document.getElementById(id).showModal();
                      }}
                    >
                      <IconInfoCircle stroke={1} />
                    </button> */}
                    <button
                      className="btn btn-outline btn-primary btn-sm"
                      onClick={() => {
                        download(video.file_name);
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
      {/* <DetailModal id={id} fileName={fileName} /> */}
    </>
  );
};

export default CompressedVideoList;
