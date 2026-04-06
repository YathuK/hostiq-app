import mongoose, { Schema, models } from "mongoose";

const HostSchema = new Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  // Email auto-responder settings
  emailSettings: {
    enabled: { type: Boolean, default: false },
    imapHost: { type: String, default: "imap.gmail.com" },
    imapPort: { type: Number, default: 993 },
    smtpHost: { type: String, default: "smtp.gmail.com" },
    smtpPort: { type: Number, default: 587 },
    emailAddress: { type: String, default: "" },
    appPassword: { type: String, default: "" },
    lastCheckedUid: { type: String, default: "" },
    responseTone: { type: String, default: "friendly" },
  },
});

export default models.Host || mongoose.model("Host", HostSchema);
