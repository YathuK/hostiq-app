import mongoose, { Schema, models } from "mongoose";

const MessageSchema = new Schema({
  propertyId: { type: Schema.Types.ObjectId, ref: "Property" },
  hostId: { type: Schema.Types.ObjectId, ref: "Host" },
  guestName: { type: String, default: "Guest" },
  guestMessage: { type: String, required: true },
  aiResponse: { type: String },
  channel: { type: String, enum: ["sms", "manual", "airbnb"], default: "manual" },
  phone: { type: String },
  sent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default models.Message || mongoose.model("Message", MessageSchema);
