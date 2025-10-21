import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {registerUser} from '../features/actions/userAction.jsx'
import { toast } from 'react-toastify'
import { useDispatch } from "react-redux";

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Japanese']
const Register = () => {
  const dispatch = useDispatch();
const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })

  const onSubmit = async(data) => { 
    console.log('Form Data:', data)
 // ✅ Call the Redux action and wait for the result
  const result = await  dispatch(registerUser(data));

  // ✅ Check result
  if (result.success) {
    toast.success("Registration successful!");
navigate("/")

  } else {
    toast.error(`Registration failed: ${result.message}`);
  }

    
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left side */}
        <div className="p-10 bg-gradient-to-b from-sky-50 to-indigo-50 flex flex-col justify-center">
          <div className="text-indigo-700 font-extrabold text-2xl">Translator</div>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">Create your account</h2>
          <p className="mt-3 text-slate-500">Fast, secure translations. Sign up to save translation history, bookmarks and more.</p>
          <div className="mt-6 h-48 rounded-lg overflow-hidden">
            <img src="/imgs/show.jpg" alt="" aria-hidden className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Right side form */}
        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">First name</label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-sky-200 focus:outline-none"
                  placeholder="Jane"
                />
                {errors.firstName && <div className="text-sm text-red-500 mt-1">{errors.firstName.message}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Last name</label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-sky-200 focus:outline-none"
                  placeholder="Doe"
                />
                {errors.lastName && <div className="text-sm text-red-500 mt-1">{errors.lastName.message}</div>}
              </div>
            </div>

            {/* ✅ Email field added here */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                type="email"
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-sky-200 focus:outline-none"
                placeholder="you@example.com"
              />
              {errors.email && <div className="text-sm text-red-500 mt-1">{errors.email.message}</div>}
            </div>

            {/* Password fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                  type="password"
                  className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-sky-200 focus:outline-none"
                  placeholder="Create a password"
                />
                {errors.password && <div className="text-sm text-red-500 mt-1">{errors.password.message}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Confirm password</label>
                <input
                  {...register('confirmPassword', {
                    required: 'Confirm your password',
                    validate: (v) => v === watch('password') || 'Passwords do not match',
                  })}
                  type="password"
                  className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-sky-200 focus:outline-none"
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && <div className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</div>}
              </div>
            </div>

            {/* Language selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Preferred language</label>
              <select
                {...register('language')}
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-sky-200 focus:outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  {...register('agree', { required: true })}
                  aria-describedby="terms"
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label className="font-medium text-slate-700">
                  I agree to the{' '}
                  <Link to="#" className="text-indigo-600 underline">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link to="#" className="text-indigo-600 underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
                {errors.agree && <div className="text-sm text-red-500 mt-1">You must agree to the terms</div>}
              </div>
            </div>

            {/* Submit + link */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <button
                type="submit"
                className="w-full md:w-auto inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white px-5 py-2 font-semibold shadow"
              >
                Create account
              </button>
              <div className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 underline">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
