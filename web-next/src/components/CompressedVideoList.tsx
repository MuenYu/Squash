import { DateTime } from "luxon";
import { IconDownload } from "@tabler/icons-react";

interface Video {
  compression_level: string;
  original_name: string;
  create_time: string;
  file_name: string;
}

const mockVideoList: Video[] = [
  {
    compression_level: '28',
    original_name: 'vacation.mp4',
    create_time: '2024-03-15T10:30:00',
    file_name: 'compressed_vacation.mp4'
  },
  {
    compression_level: '38',
    original_name: 'birthday.mp4',
    create_time: '2024-03-14T15:45:00',
    file_name: 'compressed_birthday.mp4'
  },
  {
    compression_level: '48',
    original_name: 'wedding.mp4',
    create_time: '2024-03-13T09:20:00',
    file_name: 'compressed_wedding.mp4'
  }
];

const CompressedVideoList = () => {
  const compressionMap: Record<string, string> = {
    '28': 'Low',
    '38': 'Medium',
    '48': 'High'
  };

  return (
    <>
      <h1 className="font-medium mb-2">Your compressed videos:</h1>
      {mockVideoList.length === 0 ? (
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
            {mockVideoList
              .filter((item) => !!item.compression_level)
              .map((video, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{video.original_name}</td>
                  <td>
                    {DateTime.fromISO(video.create_time).toFormat(
                      "yyyy-MM-dd HH:mm"
                    )}
                  </td>
                  <td>{compressionMap[video.compression_level]}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-outline btn-primary btn-sm"
                      disabled
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
