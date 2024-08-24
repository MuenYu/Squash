import mongoose from "mongoose";

const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  original_name: {
    type: String,
    required: true,
  },
  create_time: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: String,
    required: true,
  },
  compression_level: {
    type: String,
    required: true,
  },
  file_name: {
    type: String,
    required: true
  }
});

export default mongoose.model("Video", VideoSchema);
