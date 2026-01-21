
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { registerUser } from "../../redux/thunks/authThunks/AuthThunk";
import { clearAuthError } from "../../redux/slices/authSlices/AuthSlice";
import { usePasswordStrength } from "../../hooks/usePasswordStrength";

const registerSchema = Yup.object({
  firstName: Yup.string().trim().min(2).max(50).required(),
  lastName: Yup.string().trim().min(2).max(50).required(),
  age: Yup.number().nullable(),
  email: Yup.string().trim().email("Invalid email").required("Email is required"),
  password: Yup.string().min(8).required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required(),
  gender: Yup.mixed().oneOf(["male", "female"]).required(),
});

const Register = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading, error } = useSelector((s) => s.auth);

  const [pwd, setPwd] = useState("");
  const { score, label } = usePasswordStrength(pwd);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-10">

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-center mb-3 text-gray-900 tracking-tight">
          Create Account
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Join <span className="font-bold text-blue-600">MyApp</span> today
        </p>

        {/* Hidden fake fields */}
        <form className="hidden" autoComplete="off">
          <input type="text" name="fake-username" autoComplete="username" />
          <input type="password" name="fake-password" autoComplete="new-password" />
        </form>

        <Formik
          key={location.pathname}
          initialValues={{
            firstName: "",
            lastName: "",
            age: "",
            email: "",
            password: "",
            confirmPassword: "",
            gender: "",
          }}
          validationSchema={registerSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const payload = {
              firstName: values.firstName.trim(),
              lastName: values.lastName.trim(),
              age: values.age === "" ? undefined : Number(values.age),
              email: values.email.trim().toLowerCase(),
              password: values.password,
              confirmPassword: values.confirmPassword,
              gender: values.gender,
            };

            const res = await dispatch(registerUser(payload));
            setSubmitting(false);

            if (registerUser.fulfilled.match(res)) {
              resetForm();
              toast.success(
                <span className="text-sm">
                  Registered successfully →{" "}
                  <Link to="/login" className="font-semibold text-blue-700 underline">
                    Login
                  </Link>
                </span>
              );
            } else {
              toast.error(res.payload || "Registration failed");
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit} className="space-y-6">

              {/* Form grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    First Name
                  </label>
                  <Field
                    name="firstName"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Muhammad"
                  />
                  <ErrorMessage name="firstName" className="mt-1 text-sm text-red-600" component="div" />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Last Name
                  </label>
                  <Field
                    name="lastName"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Rehan"
                  />
                  <ErrorMessage name="lastName" className="mt-1 text-sm text-red-600" component="div" />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Age (optional)
                  </label>
                  <Field
                    name="age"
                    type="number"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
                    placeholder="22"
                  />
                  <ErrorMessage name="age" className="mt-1 text-sm text-red-600" component="div" />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Gender
                  </label>
                  <Field
                    as="select"
                    name="gender"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Field>
                  <ErrorMessage name="gender" className="mt-1 text-sm text-red-600" component="div" />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Email Address
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="email" className="mt-1 text-sm text-red-600" component="div" />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Password
                  </label>
                  <Field name="password">
                    {({ field }) => (
                      <input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        onChange={(e) => {
                          field.onChange(e);
                          setPwd(e.target.value);
                        }}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </Field>

                  {/* Strength bar */}
                  <div className="mt-1">
                    <div className="h-1.5 bg-gray-200 rounded">
                      <div
                        className="h-1.5 rounded transition-all"
                        style={{
                          width: `${score}%`,
                          background: score >= 80 ? "#16a34a" : score >= 60 ? "#f59e0b" : "#ef4444",
                        }}
                      />
                    </div>

                    <small
                      className="text-[10px] font-medium"
                      style={{
                        color: score >= 80 ? "#16a34a" : score >= 60 ? "#f59e0b" : "#ef4444",
                      }}
                    >
                      {label}
                    </small>
                  </div>

                  <ErrorMessage name="password" className="mt-1 text-sm text-red-600" component="div" />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Confirm Password
                  </label>
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    className="mt-1 text-sm text-red-600"
                    component="div"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className={`w-full rounded-xl py-3 font-semibold text-white transition-all duration-200 shadow-md ${
                  loading || isSubmitting
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                {loading || isSubmitting ? "Creating..." : "Create Account"}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                  Login
                </Link>
              </p>
            </Form>
          )}
        </Formik>

      </div>
    </div>
  );
};

export default Register;














// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import toast from "react-hot-toast";
// import { registerUser } from "../../redux/thunks/authThunks/AuthThunk";
// import { clearAuthError } from "../../redux/slices/authSlices/AuthSlice";

// /* =========================
//    Validation Schema
// ========================= */
// const registerSchema = Yup.object({
//   firstName: Yup.string()
//     .trim()
//     .min(2, "First name is too short")
//     .max(50, "First name is too long")
//     .matches(/^[A-Za-zÀ-ÿ' -]+$/, "Only letters and spaces allowed")
//     .required("First name is required"),
//   lastName: Yup.string()
//     .trim()
//     .min(2, "Last name is too short")
//     .max(50, "Last name is too long")
//     .matches(/^[A-Za-zÀ-ÿ' -]+$/, "Only letters and spaces allowed")
//     .required("Last name is required"),
//   age: Yup.number()
//     .typeError("Age must be a number")
//     .min(0, "Age cannot be negative")
//     .max(120, "Age seems invalid")
//     .nullable()
//     .optional(),
//   email: Yup.string().trim().email("Invalid email").required("Email is required"),
//   password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password"), null], "Passwords do not match")
//     .required("Confirm your password"),
//   gender: Yup.mixed().oneOf(["male", "female"], "Select gender").required("Gender is required"),
// });

// /* =========================
//    Password Strength Helper
// ========================= */
// const getPasswordStrength = (pwd) => {
//   const rules = [
//     pwd.length >= 8,
//     /[A-Z]/.test(pwd),
//     /[a-z]/.test(pwd),
//     /\d/.test(pwd),
//     /[^A-Za-z0-9]/.test(pwd),
//   ];
//   const passed = rules.filter(Boolean).length;
//   const score = Math.round((passed / 5) * 100);
//   let label = "Weak";
//   if (score >= 80) label = "Strong";
//   else if (score >= 60) label = "Medium";
//   return { score, label };
// };

// const Register = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate(); // 👈 needed for toast button
//   const location = useLocation();
//   const { loading, error } = useSelector((s) => s.auth);

//   const [pwd, setPwd] = useState("");
//   const { score, label } = getPasswordStrength(pwd);

//   useEffect(() => {
//     dispatch(clearAuthError());
//   }, [dispatch]);

//   useEffect(() => {
//     if (error) toast.error(error);
//   }, [error]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-3">
//       <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6 md:p-7">
//         <div className="mb-4">
//           <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
//             Create Account
//           </h1>
//         </div>

//         {/* Hidden fake fields to discourage autofill */}
//         <form className="hidden" autoComplete="off">
//           <input type="text" name="fake-username" autoComplete="username" />
//           <input type="password" name="fake-password" autoComplete="new-password" />
//         </form>

//         <Formik
//           key={location.pathname}
//           initialValues={{
//             firstName: "",
//             lastName: "",
//             age: "",
//             email: "",
//             password: "",
//             confirmPassword: "",
//             gender: "",
//           }}
//           validationSchema={registerSchema}
//           onSubmit={async (values, { setSubmitting, resetForm }) => {
//             const payload = {
//               firstName: values.firstName.trim(),
//               lastName: values.lastName.trim(),
//               age: values.age === "" ? undefined : Number(values.age),
//               email: values.email.trim().toLowerCase(),
//               password: values.password,
//               confirmPassword: values.confirmPassword,
//               gender: values.gender,
//             };

//             const res = await dispatch(registerUser(payload));
//             setSubmitting(false);

//             if (registerUser.fulfilled.match(res)) {
//               resetForm();

//               // ✅ Toast with "Go to Login" clickable button
//               toast.custom(
//                 (t) => (
//                   <div
//                     className={`max-w-sm w-full rounded-lg shadow-md border p-4 bg-white ${
//                       t.visible ? "animate-enter" : "animate-leave"
//                     }`}
//                   >
//                     <p className="text-sm text-gray-800">
//                       <span className="font-semibold">Registered successfully.</span>{" "}
//                       Please login to continue.
//                     </p>

//                     <div className="mt-3 flex items-center gap-2">
//                       <button
//                         onClick={() => {
//                           toast.dismiss(t.id);
//                           navigate("/login");
//                         }}
//                         className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
//                       >
//                         Go to Login
//                       </button>

//                       <button
//                         onClick={() => toast.dismiss(t.id)}
//                         className="px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
//                       >
//                         Dismiss
//                       </button>
//                     </div>
//                   </div>
//                 ),
//                 { duration: 5000, position: "top-right" }
//               );
//             } else if (registerUser.rejected.match(res)) {
//               toast.error(res.payload || "Registration failed");
//             }
//           }}
//         >
//           {({ isSubmitting, handleSubmit }) => (
//             <Form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 gap-3">
//                 {/* First Name */}
//                 <div>
//                   <label className="block text-xs font-medium mb-1 text-gray-700" htmlFor="firstName">
//                     First Name <span className="text-red-500">*</span>
//                   </label>
//                   <Field
//                     id="firstName"
//                     name="firstName"
//                     type="text"
//                     placeholder="Muhammad"
//                     autoComplete="given-name"
//                     className="w-full h-10 text-sm border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   />
//                   <ErrorMessage name="firstName" component="div" className="mt-1 text-xs text-red-600" />
//                 </div>

//                 {/* Last Name */}
//                 <div>
//                   <label className="block text-xs font-medium mb-1 text-gray-700" htmlFor="lastName">
//                     Last Name <span className="text-red-500">*</span>
//                   </label>
//                   <Field
//                     id="lastName"
//                     name="lastName"
//                     type="text"
//                     placeholder="Rehan"
//                     autoComplete="family-name"
//                     className="w-full h-10 text-sm border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   />
//                   <ErrorMessage name="lastName" component="div" className="mt-1 text-xs text-red-600" />
//                 </div>

//                 {/* Age (optional) */}
//                 <div>
//                   <label className="block text-xs font-medium mb-1 text-gray-700" htmlFor="age">
//                     Age (optional)
//                   </label>
//                   <Field
//                     id="age"
//                     name="age"
//                     type="number"
//                     inputMode="numeric"
//                     min="0"
//                     max="120"
//                     placeholder="22"
//                     className="w-full h-10 text-sm border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   />
//                   <ErrorMessage name="age" component="div" className="mt-1 text-xs text-red-600" />
//                 </div>

//                 {/* Gender */}
//                 <div>
//                   <label className="block text-xs font-medium mb-1 text-gray-700" htmlFor="gender">
//                     Gender <span className="text-red-500">*</span>
//                   </label>
//                   <Field
//                     as="select"
//                     id="gender"
//                     name="gender"
//                     className="w-full h-10 text-sm border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   >
//                     <option value="">Select gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                   </Field>
//                   <ErrorMessage name="gender" component="div" className="mt-1 text-xs text-red-600" />
//                 </div>

//                 {/* Email */}
//                 <div className="md:col-span-2">
//                   <label className="block text-xs font-medium mb-1 text-gray-700" htmlFor="email">
//                     Email Address <span className="text-red-500">*</span>
//                   </label>
//                   <Field
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="you@example.com"
//                     autoComplete="email"
//                     className="w-full h-10 text-sm border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   />
//                   <ErrorMessage name="email" component="div" className="mt-1 text-xs text-red-600" />
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label className="block text-xs font-medium mb-1 text-gray-700" htmlFor="password">
//                     Password <span className="text-red-500">*</span>
//                   </label>

//                   <Field name="password">
//                     {({ field }) => (
//                       <input
//                         id="password"
//                         type="password"
//                         placeholder="••••••••"
//                         autoComplete="new-password"
//                         className="w-full h-10 text-sm border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                         {...field}
//                         onChange={(e) => {
//                           field.onChange(e);
//                           setPwd(e.target.value);
//                         }}
//                       />
//                     )}
//                   </Field>

//                   {/* Compact strength bar */}
//                   <div className="mt-1">
//                     <div className="h-1.5 bg-gray-200 rounded">
//                       <div
//                         className="h-1.5 rounded transition-all"
//                         style={{
//                           width: `${score}%`,
//                           background: score >= 80 ? "#16a34a" : score >= 60 ? "#f59e0b" : "#ef4444",
//                         }}
//                       />
//                     </div>
//                     <small
//                       className="text-[10px] font-medium"
//                       style={{
//                         color: score >= 80 ? "#16a34a" : score >= 60 ? "#f59e0b" : "#ef4444",
//                       }}
//                     >
//                       {label}
//                     </small>
//                   </div>

//                   <ErrorMessage name="password" component="div" className="mt-1 text-xs text-red-600" />
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <label className="block text-xs font-medium mb-1 text-gray-700" htmlFor="confirmPassword">
//                     Confirm Password <span className="text-red-500">*</span>
//                   </label>
//                   <Field
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type="password"
//                     placeholder="Re-enter password"
//                     autoComplete="new-password"
//                     className="w-full h-10 text-sm border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   />
//                   <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-xs text-red-600" />
//                 </div>
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 disabled={loading || isSubmitting}
//                 className={`w-full h-10 rounded-lg text-sm font-semibold text-white transition-all duration-200 ${
//                   loading || isSubmitting
//                     ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700 shadow-sm"
//                 }`}
//               >
//                 {loading || isSubmitting ? "Creating..." : "Create Account"}
//               </button>

//               {/* Login link (tight spacing) */}
//               <p className="text-center text-xs text-gray-600">
//                 Already have an account?{" "}
//                 <Link to="/login" className="font-semibold text-blue-600 hover:underline">
//                   Login
//                 </Link>
//               </p>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default Register;
