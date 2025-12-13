import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginUser, fetchUserProfile } from "../features/actions/userAction";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 📌 Handle Google redirect → token is in cookie, fetch user & go to home
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error) {
      toast.error(`Google login failed: ${error}`);
      return;
    }

    // Check if user was just redirected from Google (cookie was set by backend)
    // Fetch the user profile to confirm logged in
    const checkAndRedirect = async () => {
      try {
        const result = await dispatch(fetchUserProfile());
        if (result?.id) {
          toast.success("Logged in successfully!");
          navigate("/");
        }
      } catch (err) {
        // Not logged in, stay on login page
      }
    };

    checkAndRedirect();
  }, [dispatch, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));

    if (result.success) {
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left section */}
        <div className="p-10 bg-gradient-to-b from-indigo-50 to-sky-50 flex flex-col justify-center">
          <div className="text-indigo-700 font-extrabold text-2xl">Translator</div>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">Welcome back</h2>
          <p className="mt-3 text-slate-500">
            Log in to access your translations, saved history, and personalized preferences.
          </p>
          <div className="mt-6 h-48 rounded-lg overflow-hidden">
            <img
              src="https://i.pinimg.com/1200x/58/ec/72/58ec72a7e4a38b1c677e2aa37f2ceaeb.jpg"
              alt="login"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right section — login form */}
        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                type="email"
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-sky-200 focus:outline-none"
                placeholder="you@example.com"
              />
              {errors.email && (
                <span className="text-sm text-red-500">{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-sky-200 focus:outline-none"
                placeholder="Enter your password"
              />
              {errors.password && (
                <span className="text-sm text-red-500">{errors.password.message}</span>
              )}
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white px-5 py-2 font-semibold shadow"
            >
              Sign in
            </button>

            {/* Google login */}
            <button
              type="button"
              onClick={() => {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://translator-lo1e.onrender.com";
                window.location.href = `${backendUrl}/api/auth/google`;
              }}
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg border px-3 py-2 font-semibold bg-white shadow hover:bg-slate-50"
            >
             <img
  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
  alt="google"
  className="w-5 h-5"
/>

              Continue with Google
            </button>

            {/* Register link */}
            <div className="text-sm text-center text-slate-500 mt-4">
              Don’t have an account?{" "}
              <Link to="/register" className="text-indigo-600 underline">
                Create one
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
