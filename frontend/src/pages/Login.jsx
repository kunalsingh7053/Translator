import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginUser } from "../features/actions/userAction"; // 👈 create this if not made yet

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    console.log("Login Data:", data);
    const result = await dispatch(loginUser(data));

    if (result.success) {
      toast.success("Login successful!");
      navigate("/home"); // redirect to your home/dashboard
    } else {
      toast.error(`Login failed: ${result.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left side */}
        <div className="p-10 bg-gradient-to-b from-indigo-50 to-sky-50 flex flex-col justify-center">
          <div className="text-indigo-700 font-extrabold text-2xl">Translator</div>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">Welcome back</h2>
          <p className="mt-3 text-slate-500">
            Log in to access your translations, saved history, and personalized preferences.
          </p>
          <div className="mt-6 h-48 rounded-lg overflow-hidden">
            <img src="/imgs/show.jpg" alt="login" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Right side form */}
        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                type="email"
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-sky-200 focus:outline-none"
                placeholder="you@example.com"
              />
              {errors.email && (
                <div className="text-sm text-red-500 mt-1">{errors.email.message}</div>
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
                <div className="text-sm text-red-500 mt-1">{errors.password.message}</div>
              )}
            </div>

            {/* Submit */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <button
                type="submit"
                className="w-full md:w-auto inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white px-5 py-2 font-semibold shadow"
              >
                Sign in
              </button>
              <div className="text-sm text-slate-500">
                Don’t have an account?{" "}
                <Link to="/register" className="text-indigo-600 underline">
                  Create one
                </Link>
              </div>
            </div>

            {/* Forgot Password link (optional) */}
            <div className="text-right mt-2">
              <Link to="#" className="text-sm text-indigo-600 underline">
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
