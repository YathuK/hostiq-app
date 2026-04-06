import mongoose, { Schema, models } from "mongoose";

const PropertySchema = new Schema({
  hostId: { type: Schema.Types.ObjectId, ref: "Host", required: true },
  name: { type: String, required: true },
  icalUrl: { type: String, required: true },
  accessCode: { type: String },
  cleaningFee: { type: Number },
  checklist: { type: [String], default: [
    "Vacuum all floors",
    "Mop hard surfaces",
    "Clean kitchen counters and appliances",
    "Sanitize bathrooms",
    "Change all bed linens",
    "Replace towels",
    "Take out trash and recycling",
    "Check for guest damage",
  ]},
  primaryCleaner: {
    name: String,
    phone: String,
  },
  backupCleaner: {
    name: String,
    phone: String,
  },
});

export default models.Property || mongoose.model("Property", PropertySchema);
