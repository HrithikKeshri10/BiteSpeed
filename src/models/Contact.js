import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      sparse: true,
      default: null,
    },
    email: {
      type: String,
      sparse: true,
      default: null,
    },
    linkedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      default: null,
    },
    linkPrecedence: {
      type: String,
      enum: ["primary", "secondary"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

contactSchema.index({ email: 1, phoneNumber: 1 });
contactSchema.index({ linkedId: 1 });
contactSchema.index({ deletedAt: 1 });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
