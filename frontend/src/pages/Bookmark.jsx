import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import {
  createFolder,
  createFile,
  fetchFolders,
  fetchFiles,
  fetchBookmarks,
  deleteFolder,
  deleteFile,
} from '../features/actions/bookmarkAction'
import {
  FolderIcon,
  DocumentIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

const Bookmark = () => {
  const dispatch = useDispatch()
  const { folders, files, bookmarks, loading, error } = useSelector(
    (state) => state.bookmark
  )
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [showNewFileDialog, setShowNewFileDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFileName, setNewFileName] = useState('')

  useEffect(() => {
    dispatch(fetchFolders())
  }, [dispatch])

  useEffect(() => {
    if (selectedFolder) dispatch(fetchFiles(selectedFolder._id))
  }, [dispatch, selectedFolder])

  useEffect(() => {
    if (selectedFile) dispatch(fetchBookmarks(selectedFile._id))
  }, [dispatch, selectedFile])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleCreateFolder = async (e) => {
    e.preventDefault()
    try {
      await dispatch(createFolder(newFolderName))
      setNewFolderName('')
      setShowNewFolderDialog(false)
      toast.success('Folder created successfully')
    } catch {
      toast.error('Failed to create folder')
    }
  }

  const handleCreateFile = async (e) => {
    e.preventDefault()
    if (!selectedFolder) return toast.error('Please select a folder first')

    try {
      await dispatch(createFile(selectedFolder._id, newFileName))
      setNewFileName('')
      setShowNewFileDialog(false)
      toast.success('File created successfully')
    } catch {
      toast.error('Failed to create file')
    }
  }

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm('Delete this folder?')) return
    try {
      await dispatch(deleteFolder(folderId))
      toast.success('Folder deleted')

      if (selectedFolder?._id === folderId) {
        setSelectedFolder(null)
        setSelectedFile(null)
      }
    } catch {
      toast.error('Failed to delete folder')
    }
  }

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Delete this file?')) return
    try {
      await dispatch(deleteFile(fileId))
      toast.success('File deleted')
      if (selectedFile?._id === fileId) setSelectedFile(null)
    } catch {
      toast.error('Failed to delete file')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Your Bookmarks
            </h1>
            <button
              onClick={() => setShowNewFolderDialog(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Folder
            </button>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Folders */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white shadow rounded-lg p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Folders</h2>
              </div>
              <div className="space-y-2">
                {folders.map((folder) => (
                  <div
                    key={folder._id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition ${
                      selectedFolder?._id === folder._id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div
                      onClick={() => setSelectedFolder(folder)}
                      className="flex items-center flex-1"
                    >
                      <FolderIcon className="h-5 w-5 mr-2" />
                      <span className="truncate">{folder.title}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteFolder(folder._id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      title="Delete folder"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Files */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white shadow rounded-lg p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Files</h2>
                {selectedFolder && (
                  <button
                    onClick={() => setShowNewFileDialog(true)}
                    className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    New File
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file._id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition ${
                      selectedFile?._id === file._id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div
                      onClick={() => setSelectedFile(file)}
                      className="flex items-center flex-1"
                    >
                      <DocumentIcon className="h-5 w-5 mr-2" />
                      <span className="truncate">{file.title}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteFile(file._id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      title="Delete file"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bookmarks */}
            <div className="col-span-12 lg:col-span-5 bg-white shadow rounded-lg p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Translations
              </h2>
              {selectedFile ? (
                bookmarks.length > 0 ? (
                  <div className="space-y-4">
                    {bookmarks.map((bookmark) => (
                      <div
                        key={bookmark._id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <p className="text-gray-600 mb-2">
                          {bookmark.msg?.sourceText || 'No source text'}
                        </p>
                        <p className="text-gray-900">
                          {bookmark.msg?.translatedText || 'No translation'}
                        </p>
                        <div className="mt-2 text-sm text-gray-500">
                          {bookmark.msg?.sourceLang || '?'} →{' '}
                          {bookmark.msg?.targetLang || '?'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No bookmarks in this file yet.</p>
                )
              ) : (
                <p className="text-gray-500">Select a file to view bookmarks.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Folder Dialog */}
      {showNewFolderDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Folder
            </h3>
            <form onSubmit={handleCreateFolder}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full border-gray-300 rounded-md shadow-sm mb-4 p-2"
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewFolderDialog(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New File Dialog */}
      {showNewFileDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New File
            </h3>
            <form onSubmit={handleCreateFile}>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="File name"
                className="w-full border-gray-300 rounded-md shadow-sm mb-4 p-2"
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewFileDialog(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-25 flex items-center justify-center">
          <div className="bg-white p-4 rounded-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bookmark
