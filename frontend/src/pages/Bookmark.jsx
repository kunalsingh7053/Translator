import React from 'react'
import Navbar from '../components/Navbar'

const Bookmark = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Bookmarks</h1>
          <div className="bg-white shadow rounded-lg p-6">
            {/* Bookmark content will go here */}
            <p className="text-gray-500">Your saved translations will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bookmark
