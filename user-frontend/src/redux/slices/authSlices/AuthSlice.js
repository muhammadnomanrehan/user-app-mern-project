
// import { createSlice } from "@reduxjs/toolkit";
// import { loginUser, logoutUser, registerUser } from "../../thunks/authThunks/AuthThunk";

// const initialState = {
//   user: null,
//   isAuthenticated: false,
//   loading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     // client-only logout (if needed without server call)
//     logoutClient(state) {
//       state.user = null;
//       state.isAuthenticated = false;
//     },
//     // NEW: clear stale server errors on screen mount/switch
//     clearAuthError(state) {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // REGISTER
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state) => {
//         state.loading = false;
//         // After register, user will login next
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // LOGIN
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.isAuthenticated = true;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // LOGOUT
//       .addCase(logoutUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.loading = false;
//         state.user = null;
//         state.isAuthenticated = false;
//       })
//       .addCase(logoutUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { logoutClient, clearAuthError } = authSlice.actions;
// export default authSlice.reducer;





import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  logoutUser,
  registerUser,
  requestOtp,
  verifyOtp,
  resetPassword,
} from "../../thunks/authThunks/AuthThunk";

const initialState = {
  // Auth
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Forgot Password Flow
  fpEmail: null,        // user email captured during forget flow
  resetToken: null,     // short-lived JWT returned after OTP verification
  fpMessage: null,      // success/info message specific to forgot flow
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // client-only logout (if needed without server call)
    logoutClient(state) {
      state.user = null;
      state.isAuthenticated = false;

      // also clear forgot-password state
      state.fpEmail = null;
      state.resetToken = null;
      state.fpMessage = null;
      state.error = null;
      state.loading = false;
    },
    // clear generic errors on screen mount/switch
    clearAuthError(state) {
      state.error = null;
    },
    // clear forgot password flow messages
    clearFpMessage(state) {
      state.fpMessage = null;
    },
    // optional: manually clear reset token (after use)
    clearResetToken(state) {
      state.resetToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ========== REGISTER ========== */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        // After register, user will login next
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to register";
      })

      /* ========== LOGIN ========== */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || null;
        state.isAuthenticated = !!action.payload?.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to login";
      })

      /* ========== LOGOUT ========== */
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;

        // also clear forgot flow
        state.fpEmail = null;
        state.resetToken = null;
        state.fpMessage = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to logout";
      })

      /* ========== FORGET PASSWORD: REQUEST OTP ========== */
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fpMessage = null;
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.fpEmail = action.payload?.email || null;
        state.fpMessage =
          action.payload?.message || "If this email exists, an OTP has been sent.";
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send OTP";
      })

      /* ========== FORGET PASSWORD: VERIFY OTP ========== */
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fpMessage = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.resetToken = action.payload?.resetToken || null;
        state.fpEmail = action.payload?.email || state.fpEmail;
        state.fpMessage = action.payload?.message || "OTP verified";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Invalid or expired OTP";
      })

      /* ========== FORGET PASSWORD: RESET PASSWORD ========== */
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fpMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.fpMessage = action.payload?.message || "Password reset successfully.";
        // resetToken consume ho gaya, clear it
        state.resetToken = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to reset password";
      });
  },
});

export const {
  logoutClient,
  clearAuthError,
  clearFpMessage,
  clearResetToken,
} = authSlice.actions;

export default authSlice.reducer;
