import mongoose, { Schema, models } from "mongoose";

const WaitlistSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
  propertyCount: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default models.Waitlist || mongoose.model("Waitlist", WaitlistSchema);
