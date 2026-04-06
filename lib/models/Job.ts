import mongoose, { Schema, models } from "mongoose";

const JobSchema = new Schema({
  propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
  hostId: { type: Schema.Types.ObjectId, ref: "Host", required: true },
  checkoutTime: { type: Date, required: true },
  cleanerPhone: { type: String },
  cleanerToken: { type: String },
  status: {
    type: String,
    enum: ["pending", "dispatched", "confirmed", "in_progress", "complete", "damage_flagged"],
    default: "pending",
  },
  dispatchedAt: Date,
  confirmedAt: Date,
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

export default models.Job || mongoose.model("Job", JobSchema);
