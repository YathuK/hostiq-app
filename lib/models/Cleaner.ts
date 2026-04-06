import mongoose, { Schema, models } from "mongoose";

const CleanerSchema = new Schema({
  hostId: { type: Schema.Types.ObjectId, ref: "Host", required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: "" },
  rating: { type: Number, default: 5 },
  jobsCompleted: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
});

export default models.Cleaner || mongoose.model("Cleaner", CleanerSchema);
