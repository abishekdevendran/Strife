import mongoose from "mongoose";

const emailTokenSchema = new mongoose.Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  expireAt: { type: Date, default: Date.now, index: { expires: "60m" } },
});

export type TemailToken = {
  _userId: string;
  token: string;
  expireAt: string;
}

export default mongoose.model("EmailToken", emailTokenSchema);