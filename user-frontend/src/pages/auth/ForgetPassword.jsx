
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { requestOtp } from "../../redux/thunks/authThunks/AuthThunk";

// export default function ForgetPassword() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { loading, fpMessage, error } = useSelector((s) => s.auth);
//   const [email, setEmail] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email) return;

//     const res = await dispatch(requestOtp(email));
//     if (res?.meta?.requestStatus === "fulfilled") {
//       navigate("/verify-otp", { state: { email } });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
//       <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 border border-white/40">

//         <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
//           Forgot Password?
//         </h1>

//         <p className="text-center text-gray-600 mb-8 text-sm">
//           Don’t worry! Enter your email and we'll send an OTP to reset your password.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Email Input */}
//           <input
//             type="email"
//             className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             placeholder="you@example.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value.trim())}
//             required
//           />

//           {/* Submit Button */}
//           <button
//             disabled={loading}
//             className={`w-full py-3 rounded-xl font-semibold text-white shadow-md transition-all duration-200 ${
//               loading
//                 ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
//             }`}
//           >
//             {loading ? "Sending..." : "Send OTP"}
//           </button>

//           {/* Messages */}
//           {fpMessage && (
//             <p className="text-green-600 text-sm text-center font-medium">
//               {fpMessage}
//             </p>
//           )}

//           {error && (
//             <p className="text-red-600 text-sm text-center font-medium">
//               {error}
//             </p>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // 👈 add this
import { requestOtp } from "../../redux/thunks/authThunks/AuthThunk";

export default function ForgetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, fpMessage, error } = useSelector((s) => s.auth);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    const res = await dispatch(requestOtp(email));
    if (res?.meta?.requestStatus === "fulfilled") {
      // optional toast
      toast.success("If this email exists, an OTP has been sent.");
      navigate("/verify-otp", { state: { email } });
    } else {
      // optional toast for error fallback
      toast.error(typeof res?.payload === "string" ? res.payload : "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 border border-white/40">

        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Forgot Password?
        </h1>

        <p className="text-center text-gray-600 mb-8 text-sm">
          Don’t worry! Enter your email and we'll send an OTP to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            required
          />

          <button
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white shadow-md transition-all duration-200 ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          {/* Inline messages (keep) */}
          {fpMessage && (
            <p className="text-green-600 text-sm text-center font-medium">
              {fpMessage}
            </p>
          )}
          {error && (
            <p className="text-red-600 text-sm text-center font-medium">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
``
