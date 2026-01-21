
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    
roleDocument: { type: String, enum: ["user", "admin"], default: "user" },



    // 🔹 Role (placeholder for future)
    // role: {
    //   type: String,
    //   enum: ["isUser", "isAdmin"],
    //   default: "isUser",
    // },

    // 🔹 Master user flag (future use; optional)
    // isMaster: {
    //   type: Boolean,
    //   default: false,
    // },

    resetOTP: { type: String }, // e.g., "235981" (optionally hashed)
    resetOTPExpires: { type: Date },

    // (Optional future fields: username, phone, etc.)
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Unique index (already enforced by schema, but explicit is good)
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
export default User;
