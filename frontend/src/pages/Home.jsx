import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import { translateText, clearAllMessages } from "../features/actions/msgAction";
import { useDispatch, useSelector } from 'react-redux'
import { FolderIcon, DocumentIcon, BookmarkIcon, XMarkIcon } from '@heroicons/react/24/outline'
const features = [
  { title: 'Instant Translation', desc: 'Translate text in real-time between many languages.' },
  { title: 'Save History', desc: 'Keep translations for later reference and editing.' },
  { title: 'Bookmarks', desc: 'Pin your important translations for quick access.' },
]

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false) 
  const [profileOpen, setProfileOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [sourceLang, setSourceLang] = useState('English')
  const [targetLang, setTargetLang] = useState('Hindi')
  const dispatch = useDispatch()
  const messages = useSelector(state => state.msg.messages)
  const lastMessage = messages[messages.length - 1]
  const [showShareModal, setShowShareModal] = useState(false);

  // Bookmark states
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [loadingFolders, setLoadingFolders] = useState(false)
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [folderError, setFolderError] = useState(null)
  const [fileError, setFileError] = useState(null)
  
  // Load folders when modal opens
  const loadFolders = async () => {
    setFolderError(null)
    setLoadingFolders(true)
    try {
  const res = await API.get('/folders')
      const received = res.data.folders || []
      setFolders(received)
      if (received.length > 0) {
        setSelectedFolder(received[0])
        await loadFiles(received[0]._id)
      } else {
        setSelectedFolder(null)
        setFiles([])
        setSelectedFile(null)
      }
    } catch (err) {
      console.error('Failed to load folders:', err)
      const msg = err.response?.data?.message || err.message || 'Failed to load folders'
      setFolderError(msg)
      toast.error(msg)
    } finally {
      setLoadingFolders(false)
    }
  }

  // Load files for selected folder
  const loadFiles = async (folderId) => {
    setFileError(null)
    setLoadingFiles(true)
    try {
  const res = await API.get(`/files/${folderId}`)
      const received = res.data.files || []
      setFiles(received)
      if (received.length > 0) {
        setSelectedFile(received[0])
      } else {
        setSelectedFile(null)
      }
    } catch (err) {
      console.error('Failed to load files:', err)
      const msg = err.response?.data?.message || err.message || 'Failed to load files'
      setFileError(msg)
      toast.error(msg)
    } finally {
      setLoadingFiles(false)
    }
  }

  // Handle bookmark button click
  const handleBookmarkClick = async () => {
    if (!inputText.trim() || !translatedText.trim()) {
      return toast.error('No translation to bookmark')
    }
    if (!lastMessage?.id) {
      return toast.error('Please translate text before bookmarking')
    }
    await loadFolders()
    setShowBookmarkModal(true)
  }

  // Handle saving bookmark
  const handleSaveBookmark = async () => {
    if (!selectedFile?._id || !selectedFolder?._id) { 
      toast.error('Please select a folder and file')
      return
    }

    try {
      await API.post('/bookmark', {
        messageId: lastMessage.id,
        folderId: selectedFolder._id,
        fileId: selectedFile._id
      })
      toast.success('Bookmarked successfully')
      setShowBookmarkModal(false)
    } catch (err) {
      console.error('Failed to save bookmark:', err)
      toast.error('Failed to save bookmark')
    }
  }

  // Handle folder change
  const handleFolderChange = async (folderId) => {
    const folder = folders.find(f => f._id === folderId)
    setSelectedFolder(folder)
    await loadFiles(folderId)
  }
 //generatesharelinks
  const getShareLinks = () => {
  if (!inputText.trim() || !translatedText.trim()) return {};
  
  // Combine source and translation
  const textToShare = `Source (${sourceLang}): ${inputText}\nTranslation (${targetLang}): ${translatedText}`;
  const encodedText = encodeURIComponent(textToShare);

  return {
    whatsapp: `https://wa.me/?text=${encodedText}`,
    telegram: `https://t.me/share/url?url=&text=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
    email: `mailto:?subject=Shared Translation&body=${encodedText}`
  };
};

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Main content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <section>
              <h1 className="text-4xl font-extrabold text-slate-900">Translate faster, save smarter</h1>
              <p className="mt-4 text-slate-600">Use the Translator to convert text between languages instantly. Save your translations, bookmark important ones, and keep a history for later.</p>
              <div className="mt-6 flex gap-4">
                <Link to="/" className="inline-flex items-center px-5 py-3 bg-indigo-600 text-white rounded-lg">Start Translating</Link>
                <Link to="/about" className="inline-flex items-center px-5 py-3 border border-slate-200 rounded-lg">Learn more</Link>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold">Features</h3>
              <ul className="mt-4 space-y-3">
                {features.map((f) => (
                  <li key={f.title} className="flex gap-3 items-start">
                    <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">{f.title.charAt(0)}</div>
                    <div>
                      <div className="font-medium text-slate-800">{f.title}</div>
                      <div className="text-slate-500 text-sm">{f.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Translator panel */}
          <div className="mt-12 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold">Translator</h3>
            <p className="text-sm text-slate-500">Type text, pick languages and translate.</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700">Source language</label>
                <select value={sourceLang} onChange={(e)=>setSourceLang(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option>
                  <option>Japanese</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700">Target language</label>
                <select value={targetLang} onChange={(e)=>setTargetLang(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2">
                  <option>Hindi</option>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option>
                  <option>Japanese</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700">Input text</label>
                <textarea value={inputText} onChange={(e)=>setInputText(e.target.value)} rows={6} className="mt-1 w-full rounded-lg border border-slate-200 p-3" placeholder="Type or paste text here"></textarea>
                <div className="mt-2 flex  sm:flex-row flex-col gap-2">

<div>

                  <button onClick={async()=>{
                    // swap
                    setSourceLang(targetLang)
                    setTargetLang(sourceLang)
                    setTranslatedText('')
                  }} className="px-3 py-1 bg-slate-100 rounded">Swap</button>
                  <button onClick={()=>{ setInputText(''); setTranslatedText('') }} className="px-3 py-1 bg-slate-100 rounded ml-2">Clear</button>
</div>
                  <button 
                    onClick={handleBookmarkClick}
                    className="px-3 py-1 bg-slate-100 rounded flex items-center gap-1"
                  >
                    <BookmarkIcon className="h-4 w-4" />
                    Bookmark
                  </button>
{translatedText&&(

<button
  onClick={() => setShowShareModal(true)}
  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
>
  Share
</button>
)}

{showShareModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Share Translation</h3>
        <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-500">
          ✖
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {Object.entries(getShareLinks()).map(([platform, url]) => (
          <button
            key={platform}
            onClick={() => window.open(url, "_blank")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Share via {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setShowShareModal(false)}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700">Translated text</label>
                <div className="mt-1 w-full min-h-[150px] rounded-lg border border-slate-200 p-3 bg-slate-50">
                  {loading ? <div className="text-slate-500">Translating…</div> : (translatedText || <div className="text-slate-400">Translation will appear here</div>)}
                </div>
              </div>
            </div>
            
            {/* Bookmark Modal */}
            {showBookmarkModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Save Translation</h3>
                    <button
                      onClick={() => setShowBookmarkModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Folder Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Folder
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      value={selectedFolder?._id || ''}
                      onChange={(e) => handleFolderChange(e.target.value)}
                    >
                      {loadingFolders ? (
                        <option value="" disabled>Loading folders...</option>
                      ) : folderError ? (
                        <>
                          <option value="" disabled>Error loading folders</option>
                        </>
                      ) : folders.length === 0 ? (
                        <option value="" disabled>No folders found</option>
                      ) : (
                        <>
                          <option value="">-- Select a folder --</option>
                          {folders.map(folder => (
                            <option key={folder._id} value={folder._id}>
                              {folder.title || folder.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    {folderError && <div className="mt-2 text-sm text-red-500">{folderError}</div>}
                  </div>

                  {/* File Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select File
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      value={selectedFile?._id || ''}
                      onChange={(e) => setSelectedFile(files.find(f => f._id === e.target.value))}
                    >
                      {loadingFiles ? (
                        <option value="" disabled>Loading files...</option>
                      ) : fileError ? (
                        <option value="" disabled>Error loading files</option>
                      ) : files.length === 0 ? (
                        <option value="" disabled>No files found</option>
                      ) : (
                        <>
                          <option value="">-- Select a file --</option>
                          {files.map(file => (
                            <option key={file._id} value={file._id}>
                              {file.title || file.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    {fileError && <div className="mt-2 text-sm text-red-500">{fileError}</div>}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowBookmarkModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBookmark}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <button onClick={async()=>{
                if(!inputText.trim()) return toast.error('Please enter text to translate')
                setLoading(true)
                try{
                  // backend expects { title, targetLang, sourceLang } 
                 const res = await dispatch(translateText(inputText, sourceLang, targetLang));

// access translation correctly
const translated = res?.msg?.translatedText ?? res?.translatedText ?? '';
setTranslatedText(translated);


                }catch(err){
                  console.error(err)
                  toast.error(err.response?.data?.message || 'Translation failed')
                }finally{setLoading(false)}
              }} className="px-5 py-2 bg-indigo-600 text-white rounded-lg">Translate</button>

              <button onClick={()=>{navigator.clipboard?.writeText(translatedText); toast.success('Copied to clipboard')}} className="px-4 py-2 border rounded">Copy</button>
            </div> 
          </div>

          {/* Extra sections */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold">Accurate</h4>
              <p className="text-sm text-slate-500 mt-2">High-quality translations backed by proven models.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold">Secure</h4>
              <p className="text-sm text-slate-500 mt-2">Your data and history are stored securely.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold">Fast</h4>
              <p className="text-sm text-slate-500 mt-2">Low-latency translations in real time.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
