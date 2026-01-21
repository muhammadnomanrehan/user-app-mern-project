
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { validateRegister, validateLogin } from "../utils/validators.js";
import { createToken } from "../utils/jwt.js";
import { COOKIE_NAME, cookieOptions } from "../utils/cookies.js";
import { sendOTPEmail } from "../utils/mailer.js";
import { validatePasswordPolicy } from "../utils/passwordPolicy.js";



// 6-digit OTP generator
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


/* -----------------------------
   AUTH: Register / Login / Logout
------------------------------ */

export const register = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    age,
    email,
    password,
    confirmPassword,
    gender,
    // role = "isUser",
  } = req.body || {};

  if (typeof validateRegister === "function") {
    validateRegister({ firstName, lastName, age, email, password, confirmPassword, gender });
  } else {
    const nameRegex = /^[A-Za-zÀ-ÿ' -]+$/;
    if (!firstName || firstName.trim().length < 2 || firstName.trim().length > 50 || !nameRegex.test(firstName.trim())) {
      throw new HttpError(400, "First name is invalid");
    }
    if (!lastName || lastName.trim().length < 2 || lastName.trim().length > 50 || !nameRegex.test(lastName.trim())) {
      throw new HttpError(400, "Last name is invalid");
    }
    if (age !== undefined && age !== null) {
      const n = Number(age);
      if (Number.isNaN(n) || n < 0 || n > 120) throw new HttpError(400, "Age is invalid");
    }
    if (!email) throw new HttpError(400, "Email is required");
    // if (!password || password.length < 6) throw new HttpError(400, "Password must be at least 6 characters");
    
// ✅ enforce full password policy
    if (!password) throw new HttpError(400, "Password is required");
    const policyErrors = validatePasswordPolicy(password);
    if (policyErrors.length) {
      // You can join errors if you want to show all at once:
      // throw new HttpError(400, policyErrors.join(", "));
      throw new HttpError(400, policyErrors[0]);
    }

    if (password !== confirmPassword) throw new HttpError(400, "Passwords do not match");
    if (!["male", "female"].includes(gender)) throw new HttpError(400, "Gender must be male or female");
    // if (!["isUser", "isAdmin"].includes(role)) throw new HttpError(400, "Invalid role");
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) throw new HttpError(409, "Email already exists");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    age: age ?? undefined,
    email: normalizedEmail,
    passwordHash,
    gender,
    // role,              // for now OK (future: server-enforce "isUser")
    // isMaster: false,   // default
  });

  const safeUser = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    age: user.age ?? null,
    gender: user.gender,
    // role: user.role,
    // isMaster: user.isMaster,
    createdAt: user.createdAt,
  };

  res.status(201).json({ message: "User registered", user: safeUser });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof validateLogin === "function") {
    validateLogin({ email, password });
  } else {
    if (!email || !password) throw new HttpError(400, "Email and password required");
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) throw new HttpError(401, "Invalid email or password");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid email or password");

  const token = createToken(user); // your normal auth token
  res.cookie(COOKIE_NAME, token, cookieOptions);

  const safeUser = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    age: user.age ?? null,
    gender: user.gender,
    // role: user.role,
    // isMaster: user.isMaster,
  };

  res.json({ message: "Logged in", user: safeUser });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions });
  res.json({ message: "Logged out" });
});



/**
 * POST /auth/forget-password
 * Body: { email }
 * Always respond generic to prevent email enumeration.
 */
// export const forgetPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body || {};
//   if (!email) throw new HttpError(400, "Email is required");

//   const normalizedEmail = String(email).toLowerCase().trim();
//   const user = await User.findOne({ email: normalizedEmail });

//   // Always return generic success (even if user doesn't exist)
//   // But if user exists, create and email OTP
  
// if (user) {
//   const otp = generateOTP();              // e.g., 6-digit string
//   const otpHash = await bcrypt.hash(otp, 10);

//   user.resetOTP = otpHash;
//   user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
//   await user.save();

//   // ✅ send real email via Nodemailer (Mailtrap in dev)

// await sendOTPEmail({ to: normalizedEmail, otp, minutes: 10 });


//   // (dev-only) optionally log to console:
//   if (process.env.NODE_ENV !== "production") {
//     console.log(`[DEV] OTP for ${normalizedEmail}: ${otp}`);
//   }
// }


//   // return res.json({ message: "If this email exists, an OTP has been sent." });
  
// if (!user) {
//   throw new HttpError(404, "This email is not registered");
// }

// return res.json({ message: "OTP has been sent to your email." });

// });


export const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body || {};
  if (!email) throw new HttpError(400, "Email is required");

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  
  if (!user) {
    throw new HttpError(404, "This email is not registered");
  }

  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);

  user.resetOTP = otpHash;
  user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await user.save();

  try {
    await sendOTPEmail({ to: normalizedEmail, otp, minutes: 10 });
  } catch (e) {
    // Rollback so user isn't stuck with a non-delivered OTP
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();
    throw new HttpError(502, "Failed to send OTP email. Please try again.");
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(`[DEV] OTP for ${normalizedEmail}: ${otp}`);
  }

  return res.json({ message: "OTP has been sent to your email." });
});



/**
 * POST /auth/verify-otp
 * Body: { email, otp }
 * If valid -> return a short-lived resetToken (JWT) that the client will use to reset password.
 */
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body || {};
  if (!email || !otp) throw new HttpError(400, "Email and OTP are required");

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user || !user.resetOTP || !user.resetOTPExpires) {
    throw new HttpError(400, "Invalid or expired OTP");
  }

  if (user.resetOTPExpires.getTime() < Date.now()) {
    // Expired
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();
    throw new HttpError(400, "OTP expired. Please request a new one.");
  }

  const match = await bcrypt.compare(String(otp), user.resetOTP);
  if (!match) {
    throw new HttpError(400, "Invalid OTP");
  }

  // OTP verified → clear OTP so it cannot be reused
  user.resetOTP = undefined;
  user.resetOTPExpires = undefined;
  await user.save();

  // Issue short-lived resetToken (JWT). No DB storage needed.
  const resetToken = jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.RESET_TOKEN_SECRET || "dev-reset-secret",
    { expiresIn: process.env.RESET_TOKEN_EXPIRES || "10m" }
  );

  return res.json({ message: "OTP verified", resetToken });
});

/**
 * POST /auth/reset-password
 * Body: { resetToken, newPassword, confirmPassword }
 * Verifies resetToken, updates password, clears any residual reset fields.
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword, confirmPassword } = req.body || {};
  if (!resetToken) throw new HttpError(400, "Reset token is required");
  if (!newPassword || !confirmPassword) throw new HttpError(400, "New password and confirm password are required");
  // if (String(newPassword).length < 6) throw new HttpError(400, "Password must be at least 6 characters");
  
  
  const policyErrors = validatePasswordPolicy(newPassword);
  if (policyErrors.length) {
    throw new HttpError(400, policyErrors[0]);
  }

  if (newPassword !== confirmPassword) throw new HttpError(400, "Passwords do not match");

  let payload;
  try {
    payload = jwt.verify(
      resetToken,
      process.env.RESET_TOKEN_SECRET || "dev-reset-secret"
    );
  } catch (_e) {
    throw new HttpError(400, "Invalid or expired reset token");
  }

  const user = await User.findById(payload.sub);
  if (!user) throw new HttpError(404, "User not found");

  const passwordHash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = passwordHash;

  // Safety: clear any lingering reset fields (not strictly needed since we cleared at verify)
  user.resetOTP = undefined;
  user.resetOTPExpires = undefined;

  await user.save();

  return res.json({ message: "Password reset successfully. You can now log in." });
});
