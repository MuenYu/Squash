import mongoose from "mongoose";

const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  file_name: {
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
  isCompressed: {
    type: Boolean,
    required: true,
    default: false
  }
});

export default mongoose.model("Video", VideoSchema);
