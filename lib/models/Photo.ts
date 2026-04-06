import mongoose, { Schema, models } from "mongoose";

const PhotoSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  room: { type: String, required: true },
  imageBase64: { type: String, required: true },
  damageFlagged: { type: Boolean, default: false },
  aiNotes: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

export default models.Photo || mongoose.model("Photo", PhotoSchema);
