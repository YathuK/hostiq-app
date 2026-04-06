import mongoose, { Schema, models } from "mongoose";

const HostSchema = new Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Host || mongoose.model("Host", HostSchema);
