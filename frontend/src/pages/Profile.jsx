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

  if (!users) return null // protected route should ensure this

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
        // refresh profile from backend to ensure latest data
        await dispatch(fetchUserProfile())
        // update preview from the refreshed store (useSelector will update component)
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
    // deleteAcccount handles confirmation and dispatches removeuser on success
    if (res && res.success) {
      toast.success('Account deleted')
      navigate('/register')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => navigate(-1)} className="text-sm text-slate-500 mr-3">&larr; Back</button>
            <h2 className="text-2xl font-semibold inline">Your profile</h2>
            <p className="text-sm text-slate-500">View and update your profile information</p>
          </div>
        </div>

        <div className="mt-6 flex gap-6">
          <div className="w-28 h-28">
            <img src={preview || '/imgs/show.jpg'} alt="avatar" className="w-28 h-28 rounded-full object-cover" />
          </div>
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700">First name</label>
                  <input {...register('firstName', { required: 'First name is required' })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
                  {errors.firstName && <div className="text-sm text-red-500">{errors.firstName.message}</div>}
                </div>

                <div>
                  <label className="block text-sm text-slate-700">Last name</label>
                  <input {...register('lastName', { required: 'Last name is required' })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
                  {errors.lastName && <div className="text-sm text-red-500">{errors.lastName.message}</div>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700">Email</label>
                <input {...register('email')} disabled className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 bg-slate-50" />
              </div>

              <div>
                <label className="block text-sm text-slate-700">Change avatar</label>
                <input type="file" accept="image/*" onChange={onFile} className="mt-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700">Old password</label>
                  <input type="password" {...register('oldpassword')} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-slate-700">New password</label>
                  <input type="password" {...register('newpassword')} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-indigo-600 text-white rounded">Save changes</button>
                <button type="button" onClick={handleLogout} className="px-4 py-2 border rounded">Logout</button>
                <button type="button" onClick={handleDelete} className="ml-auto text-sm text-red-600">Delete account</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
