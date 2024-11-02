import { DateTime } from "luxon";
import { videoDownload } from "../api/requests";
import { IconDownload } from "@tabler/icons-react";

const CompressedVideoList = ({ videoList }) => {
  const download = (fileName) => {
    videoDownload(fileName)
      .then((url) => {
        window.open(url, '_blank');
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const compressionMap = {
    '28': 'Low',
    '38': 'Medium',
    '48': 'High'
  };

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
              <th>Download</th>
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
                  <td>{compressionMap[video.compression_level]}
                  </td>
                  <td className="flex gap-2">
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
    </>
  );
};

export default CompressedVideoList;
