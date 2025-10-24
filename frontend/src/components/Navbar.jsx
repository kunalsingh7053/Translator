import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {  logoutUser} from '../features/actions/userAction'

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation() 
const dispatch = useDispatch()
  const navigate = useNavigate()
  return (
    
    <>
      {/* Navbar */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md text-slate-600 hover:bg-slate-100 md:hidden">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <Link to="/" className="flex items-center ml-2 md:ml-0">
                <div className="text-indigo-600 font-bold text-xl">Translator</div>
              </Link>
            </div>

            <div className="flex items-center">
              <nav className="hidden md:flex md:space-x-6 mr-6">
                <Link 
                  to="/" 
                  className={`text-slate-700 hover:text-indigo-600 pb-1 border-b-2 ${
                    location.pathname === '/' ? 'border-indigo-600 text-indigo-600' : 'border-transparent'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className={`text-slate-700 hover:text-indigo-600 pb-1 border-b-2 ${
                    location.pathname === '/about' ? 'border-indigo-600 text-indigo-600' : 'border-transparent'
                  }`}
                >
                  About
                </Link>
                <Link 
                  to="/bookmark" 
                  className={`text-slate-700 hover:text-indigo-600 pb-1 border-b-2 ${
                    location.pathname === '/bookmark' ? 'border-indigo-600 text-indigo-600' : 'border-transparent'
                  }`}
                >
                  Bookmarks
                </Link>
              </nav>

              <div className="relative">
                <button onClick={() => setProfileOpen((s) => !s)} className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-100">
                  <img src="/imgs/show.jpg" alt="profile" className="h-9 w-9 rounded-full object-cover" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Profile</Link>
                    <Link to="/history" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">History</Link>
                    <Link onClick={()=>{
                      
                      dispatch(logoutUser())
                      navigate('/login')
                      }} className="block px-4 py-2 text-sm text-red-600 hover:bg-slate-50">Logout</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)}></div>
          <aside className="relative w-64 bg-white p-4">
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md text-slate-600 hover:bg-slate-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <nav className="mt-4 space-y-2">
              <Link 
                to="/" 
                className={`block px-2 py-2 rounded hover:bg-slate-50 ${
                  location.pathname === '/' ? 'bg-indigo-50 text-indigo-600' : ''
                }`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`block px-2 py-2 rounded hover:bg-slate-50 ${
                  location.pathname === '/about' ? 'bg-indigo-50 text-indigo-600' : ''
                }`}
              >
                About
              </Link>
              <Link 
                to="/bookmark" 
                className={`block px-2 py-2 rounded hover:bg-slate-50 ${
                  location.pathname === '/bookmark' ? 'bg-indigo-50 text-indigo-600' : ''
                }`}
              >
                Bookmarks
              </Link>
              <Link 
                to="/profile" 
                className={`block px-2 py-2 rounded hover:bg-slate-50 ${
                  location.pathname === '/profile' ? 'bg-indigo-50 text-indigo-600' : ''
                }`}
              >
                Profile
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}

export default Navbar