import { DateTime } from "luxon";
import { videoDownload } from "../api/requests";
import { saveAs } from "file-saver";

const CompressedVideoList = ({ videoList }) => {
  const download = (fileName) => {
    videoDownload(fileName)
      .then((blob) => {
        saveAs(blob, fileName);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

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
              <th>Video Name</th>
              <th>Compression Finished Time</th>
              <th>Compression Level</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {videoList.map((video, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{video.original_name}</td>
                <td>
                  {new DateTime(video.create_time).toFormat("yyyy-MM-dd HH:mm")}
                </td>
                <td>{video.compression_level}</td>
                <td>
                  <button
                    className="btn btn-outline btn-primary btn-sm"
                    onClick={() => {
                      download(video.file_name);
                    }}
                  >
                    Download
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
