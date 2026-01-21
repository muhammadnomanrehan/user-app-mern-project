// models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 🔹 Identity fields
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

    // 🔹 Contact/Login
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // NOTE: confirmPassword store NAHI karna DB me
    passwordHash: { type: String, required: true },

    // 🔹 Gender
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

// /**
//  * 🔁 Backward compatibility:
//  * Aapke purane code me `name` used tha. Ab hum name ko virtual bana rahe hain
//  * taake `user.name` still kaam kare (first + last se banega).
//  */
// userSchema.virtual("name").get(function () {
//   const fn = this.firstName ? this.firstName.trim() : "";
//   const ln = this.lastName ? this.lastName.trim() : "";
//   return `${fn} ${ln}`.trim();
// });

// Unique index (already enforced by schema, but explicit is good)
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
export default User;
