import { DateTime } from "luxon";

const videos = [
  {
    file_name: "Naruto",
    create_time: 1692727200000,
  },
  {
    file_name: "Bleach",
    create_time: 1692727400000,
  },
];

const UploadedVideoList = () => {
  return (
    <>
      <h1 className="font-medium mb-2">Your uploaded videos:</h1>
      {videos.length === 0 ? (
        <h2 className="font-medium mb-2">
          You have no video upload records yet.
        </h2>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Video Name</th>
              <th>Upload Time</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{video.file_name}</td>
                <td>
                  {DateTime.fromMillis(video.create_time).toFormat(
                    "yyyy-MM-dd HH:mm"
                  )}
                </td>
                <td>
                  <button className="btn btn-outline btn-primary btn-sm">Select</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default UploadedVideoList;
