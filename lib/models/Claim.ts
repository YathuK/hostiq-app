import mongoose, { Schema, models } from "mongoose";

const ClaimSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  guestName: { type: String },
  checkIn: { type: Date },
  checkOut: { type: Date },
  narrative: { type: String },
  itemizedCosts: [{
    item: String,
    cost: Number,
  }],
  status: { type: String, default: "draft" },
  createdAt: { type: Date, default: Date.now },
});

export default models.Claim || mongoose.model("Claim", ClaimSchema);
