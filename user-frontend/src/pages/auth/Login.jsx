
import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { loginUser } from "../../redux/thunks/authThunks/AuthThunk";
import { clearAuthError } from "../../redux/slices/authSlices/AuthSlice";

const loginSchema = Yup.object({
  email: Yup.string().trim().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    // Clear stale error on mount
    dispatch(clearAuthError());
  }, [dispatch]);

  // Show server error (if any) as toast automatically
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-10">

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-center mb-3 text-gray-900 tracking-tight">
          Welcome Back
        </h1>

        <p className="text-center text-gray-600 mb-8 text-sm">
          Sign in to continue to <span className="font-bold text-blue-600">MyApp</span>
        </p>

        {/* Hidden fake fields for autocomplete mitigation */}
        <form className="hidden" autoComplete="off">
          <input type="text" name="fake-username" autoComplete="username" />
          <input type="password" name="fake-password" autoComplete="current-password" />
        </form>

        <Formik
          key={location.pathname}
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const payload = {
              email: values.email.trim().toLowerCase(),
              password: values.password,
            };

            const res = await dispatch(loginUser(payload));
            setSubmitting(false);

            if (loginUser.fulfilled.match(res)) {
              // Success toast
              toast.success("Logged in successfully! 🎉");

              resetForm();

              // Optional: Thoda delay to let the user see the toast
              setTimeout(() => navigate("/home"), 600);
            } else {
              // If the thunk rejected without setting `error` in slice yet,
              // show a fallback
              const msg = res?.payload || "Failed to login";
              toast.error(typeof msg === "string" ? msg : "Failed to login");
            }
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <Form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Email Address
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className={`w-full rounded-xl py-3 font-semibold text-white transition-all duration-200 shadow-md ${
                  loading || isSubmitting
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                {loading || isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>

        {/* Forgot Password */}
        <p className="text-center text-sm mt-3">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-blue-600 hover:underline font-medium"
          >
            Forgot password?
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
