import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);
