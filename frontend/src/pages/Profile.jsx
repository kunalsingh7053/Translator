import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile, logoutUser, deleteAcccount, fetchUserProfile } from '../features/actions/userAction'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { users } = useSelector((state) => state.userReducer)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ mode: 'onTouched' })

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    if (users) {
      reset({
        firstName: users.fullName?.firstName || users.firstName || '',
        lastName: users.fullName?.lastName || users.lastName || '',
        email: users.email || '',
      })
      setPreview(users.imgUrl || '')
    }
  }, [users, reset])

  if (!users) return null

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(updateUserProfile(data, file))
      if (res && res.success === false) {
        toast.error(res.message || 'Update failed')
      } else {
        toast.success('Profile updated')
        await dispatch(fetchUserProfile())
        setFile(null)
      }
    } catch (err) {
      console.error(err)
      toast.error('Update failed')
    }
  }

  const handleLogout = async () => {
    const res = await dispatch(logoutUser())
    if (res.success) {
      toast.success('Logged out')
      navigate('/login')
    } else {
      toast.error(res.message || 'Logout failed')
    }
  }

  const handleDelete = async () => {
    const res = await dispatch(deleteAcccount())
    if (res && res.success) {
      toast.success('Account deleted')
      navigate('/register')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <button onClick={() => navigate(-1)} className="text-sm text-slate-500 mr-3">&larr; Back</button>
            <h2 className="text-2xl font-semibold inline">Your Profile</h2>
            <p className="text-sm text-slate-500">View and update your profile information</p>
          </div>
        </div>

        {/* Profile Image + Form */}
        <div className="mt-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden shadow-md border border-gray-200">
              <img
                src={preview || '/imgs/show.jpg'}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="mt-3 text-sm text-slate-700 font-medium">
              Change Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={onFile}
              className="mt-1 text-sm"
            />
          </div>

          {/* Profile Form */}
          <div className="flex-1 w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6 sm:mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700">First Name</label>
                  <input
                    {...register('firstName', { required: 'First name is required' })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm text-slate-700">Last Name</label>
                  <input
                    {...register('lastName', { required: 'Last name is required' })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700">Email</label>
                <input
                  {...register('email')}
                  disabled
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700">Old Password</label>
                  <input
                    type="password"
                    {...register('oldpassword')}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700">New Password</label>
                  <input
                    type="password"
                    {...register('newpassword')}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full sm:w-auto px-5 py-2 border border-slate-300 rounded hover:bg-slate-50"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full sm:w-auto px-5 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  Delete Account
                </button> 
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
