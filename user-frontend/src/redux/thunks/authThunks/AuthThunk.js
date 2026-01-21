
// import { createAsyncThunk } from "@reduxjs/toolkit";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9999/api";





// export const registerUser = createAsyncThunk(
//   "auth/registerUser",
//   async (
//     {
//       firstName,
//       lastName,
//       age,                // number | undefined
//       email,
//       password,
//       confirmPassword,
//       gender,             // "male" | "female"
//       role = "isUser",    // default
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const body = {
//         firstName: firstName?.trim(),
//         lastName: lastName?.trim(),
//         // blank string age ko undefined bhejna:
//         ...(age === "" || age === undefined || age === null
//           ? {}
//           : { age: Number(age) }),
//         email: email?.trim().toLowerCase(),
//         password,
//         confirmPassword,
//         gender,
//         role,
//       };

//       const res = await fetch(`${API_URL}/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include", // cookie-based auth ke liye
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         return rejectWithValue(data?.message || "Failed to register");
//       }
//       return data; // { message, user }
//     } catch (err) {
//       return rejectWithValue(err?.message || "Network error");
//     }
//   }
// );



// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const res = await fetch(`${API_URL}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();
//       if (!res.ok) return rejectWithValue(data?.message || "Failed to login");
//       return data; 
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );


// export const logoutUser = createAsyncThunk(
//   "auth/logoutUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await fetch(`${API_URL}/auth/logout`, {
//         method: "POST",
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (!res.ok) return rejectWithValue(data?.message || "Failed to logout");
//       return data; // { message }
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );





import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9999/api";

/* =========================
   AUTH: Register / Login / Logout
========================= */

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    {
      firstName,
      lastName,
      age, // number | undefined | ""
      email,
      password,
      confirmPassword,
      gender, // "male" | "female"
      role = "isUser",
    },
    { rejectWithValue }
  ) => {
    try {
      const body = {
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        ...(age === "" || age === undefined || age === null
          ? {}
          : { age: Number(age) }),
        email: email?.trim().toLowerCase(),
        password,
        confirmPassword,
        gender,
        role,
      };

      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data?.message || "Failed to register");
      }
      return data; // { message, user }
    } catch (err) {
      return rejectWithValue(err?.message || "Network error");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data?.message || "Failed to login");
      return data; // { message, user }
    } catch (err) {
      return rejectWithValue(err?.message || "Network error");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data?.message || "Failed to logout");
      return data; // { message }
    } catch (err) {
      return rejectWithValue(err?.message || "Network error");
    }
  }
);

/* =========================
   FORGOT PASSWORD FLOW
   1) requestOtp(email)
   2) verifyOtp({ email, otp }) -> returns resetToken
   3) resetPassword({ resetToken, newPassword, confirmPassword })
========================= */

export const requestOtp = createAsyncThunk(
  "auth/requestOtp",
  async (email, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data?.message || "Failed to send OTP");
      }
      // Always generic message expected from backend
      return { message: data?.message || "If this email exists, an OTP has been sent.", email };
    } catch (err) {
      return rejectWithValue(err?.message || "Network error");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data?.message || "Invalid or expired OTP");
      }
      // data: { message, resetToken }
      return { message: data?.message, resetToken: data?.resetToken, email };
    } catch (err) {
      return rejectWithValue(err?.message || "Network error");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ resetToken, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ resetToken, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data?.message || "Failed to reset password");
      }
      // data: { message }
      return { message: data?.message };
    } catch (err) {
      return rejectWithValue(err?.message || "Network error");
    }
  }
);
