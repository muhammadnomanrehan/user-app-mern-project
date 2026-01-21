
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { resetPassword } from "../../redux/thunks/authThunks/AuthThunk";

// const ResetPassword = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { loading, error, fpMessage, resetToken, fpEmail } = useSelector(
//     (s) => s.auth
//   );

//   const [pwd, setPwd] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [localErr, setLocalErr] = useState("");

//   useEffect(() => {
//     // Guard: if no resetToken → redirect to verify page
//     if (!resetToken) {
//       navigate("/verify-otp", { replace: true, state: { email: fpEmail } });
//     }
//   }, [resetToken, navigate, fpEmail]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLocalErr("");

//     if (pwd.length < 6)
//       return setLocalErr("Password must be at least 6 characters");
//     if (pwd !== confirm) return setLocalErr("Passwords do not match");

//     const res = await dispatch(
//       resetPassword({
//         resetToken,
//         newPassword: pwd,
//         confirmPassword: confirm,
//       })
//     );

//     if (res?.meta?.requestStatus === "fulfilled") {
//       setTimeout(() => navigate("/auth/login"), 800);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl border border-gray-200">
//       <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
//         Set New Password
//       </h1>

//       <form onSubmit={handleSubmit} className="space-y-5">
        
//         {/* New Password */}
//         <div>
//           <label className="block mb-1 font-medium text-gray-700">
//             New Password
//           </label>
//           <input
//             type="password"
//             className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             placeholder="Enter new password"
//             value={pwd}
//             onChange={(e) => setPwd(e.target.value)}
//             required
//           />
//         </div>

//         {/* Confirm Password */}
//         <div>
//           <label className="block mb-1 font-medium text-gray-700">
//             Confirm Password
//           </label>
//           <input
//             type="password"
//             className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             placeholder="Re-enter new password"
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//             required
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold disabled:opacity-60"
//         >
//           {loading ? "Resetting..." : "Reset Password"}
//         </button>

//         {/* Messages */}
//         {localErr && (
//           <p className="text-red-600 text-sm text-center">{localErr}</p>
//         )}
//         {error && (
//           <p className="text-red-600 text-sm text-center">{error}</p>
//         )}
//         {fpMessage && (
//           <p className="text-green-600 text-sm text-center">{fpMessage}</p>
//         )}
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;




import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // 
import { resetPassword } from "../../redux/thunks/authThunks/AuthThunk";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, fpMessage, resetToken, fpEmail } = useSelector((s) => s.auth);

  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localErr, setLocalErr] = useState("");

  useEffect(() => {
    if (!resetToken) {
      navigate("/verify-otp", { replace: true, state: { email: fpEmail } });
    }
  }, [resetToken, navigate, fpEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErr("");

    if (pwd.length < 6) return setLocalErr("Password must be at least 6 characters");
    if (pwd !== confirm) return setLocalErr("Passwords do not match");

    const res = await dispatch(
      resetPassword({
        resetToken,
        newPassword: pwd,
        confirmPassword: confirm,
      })
    );

    if (res?.meta?.requestStatus === "fulfilled") {
      toast.success("Password reset successfully. Please login.");
      setTimeout(() => navigate("/auth/login"), 800);
    } else {
      toast.error(typeof res?.payload === "string" ? res.payload : "Failed to reset password");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Set New Password
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700">New Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter new password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Re-enter new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {/* Inline messages */}
        {localErr && <p className="text-red-600 text-sm text-center">{localErr}</p>}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {fpMessage && <p className="text-green-600 text-sm text-center">{fpMessage}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
