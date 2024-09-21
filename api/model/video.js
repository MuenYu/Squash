import mongoose from "mongoose";

const compressionSchema = new mongoose.Schema({
  compression_level: { type: String, required: true }, // Could be 'high', 'medium', 'low', or a percentage.
  original_size: { type: Number, required: true }, // Size in bytes
  compressed_size: { type: Number, required: true }, // Size in bytes
  compression_ratio: { type: String, required: true } // e.g., "2:1"
});

const videoSchema = new mongoose.Schema({
  file_name: { type: String, required: true }, // Name of the file
  original_name: { type: String, required: true }, // Name of the original name
  owner: { type: String, required: true }, // Owner of the file
  create_time: { type: Date, default: Date.now }, // Creation or upload time
  compression: {
    type: compressionSchema,
    required: false
  }
});

const Video = mongoose.model('Video', videoSchema);
export default Video;
