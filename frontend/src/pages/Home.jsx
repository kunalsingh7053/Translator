import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import { translateText, clearAllMessages } from "../features/actions/msgAction";
import { useDispatch, useSelector } from 'react-redux'
import { BookmarkIcon, XMarkIcon } from '@heroicons/react/24/outline'

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
  const [showShareModal, setShowShareModal] = useState(false)

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

  // Load folders
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
      const msg = err.response?.data?.message || err.message || 'Failed to load folders'
      setFolderError(msg)
      toast.error(msg)
    } finally {
      setLoadingFolders(false)
    }
  }

  // Load files
  const loadFiles = async (folderId) => {
    setFileError(null)
    setLoadingFiles(true)
    try {
      const res = await API.get(`/files/${folderId}`)
      const received = res.data.files || []
      setFiles(received)
      if (received.length > 0) setSelectedFile(received[0])
      else setSelectedFile(null)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load files'
      setFileError(msg)
      toast.error(msg)
    } finally {
      setLoadingFiles(false)
    }
  }

  const handleBookmarkClick = async () => {
    if (!inputText.trim() || !translatedText.trim()) return toast.error('No translation to bookmark')
    if (!lastMessage?.id) return toast.error('Please translate text before bookmarking')
    await loadFolders()
    setShowBookmarkModal(true)
  }

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
      toast.error('Failed to save bookmark')
    }
  }

  const handleFolderChange = async (folderId) => {
    const folder = folders.find(f => f._id === folderId)
    setSelectedFolder(folder)
    await loadFiles(folderId)
  }

  // Share links generator
  const getShareLinks = () => {
    if (!inputText.trim() || !translatedText.trim()) return {}
    const textToShare = `Source (${sourceLang}): ${inputText}\nTranslation (${targetLang}): ${translatedText}`
    const encodedText = encodeURIComponent(textToShare)
    return {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      telegram: `https://t.me/share/url?url=&text=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      email: `mailto:?subject=Shared Translation&body=${encodedText}`
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <section>
              <h1 className="text-4xl font-extrabold text-slate-900">Translate faster, save smarter</h1>
              <p className="mt-4 text-slate-600">Use the Translator to convert text between languages instantly. Save your translations, bookmark important ones, and keep a history for later.</p>
              <div className="mt-6 flex gap-4 flex-wrap">
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

          {/* Translator Panel */}
          <div className="mt-12 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold">Translator</h3>
            <p className="text-sm text-slate-500">Type text, pick languages and translate.</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700">Source language</label>
                <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2">
                  <option>English</option><option>Hindi</option><option>Spanish</option><option>French</option><option>German</option><option>Chinese</option><option>Japanese</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700">Target language</label>
                <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2">
                  <option>Hindi</option><option>English</option><option>Spanish</option><option>French</option><option>German</option><option>Chinese</option><option>Japanese</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700">Input text</label>
                <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} rows={6} className="mt-1 w-full rounded-lg border border-slate-200 p-3" placeholder="Type or paste text here"></textarea>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button onClick={() => { setSourceLang(targetLang); setTargetLang(sourceLang); setTranslatedText('') }} className="px-3 py-1 bg-slate-100 rounded">Swap</button>
                  <button onClick={() => { setInputText(''); setTranslatedText('') }} className="px-3 py-1 bg-slate-100 rounded">Clear</button>
                  <button onClick={handleBookmarkClick} className="px-3 py-1 bg-slate-100 rounded flex items-center gap-1">
                    <BookmarkIcon className="h-4 w-4" /> Bookmark
                  </button>

                  {translatedText && (
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full sm:w-auto mt-2 sm:mt-0"
                    >
                      Share
                    </button>
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

            {/* ✅ Responsive Share Modal */}
            {showShareModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm md:max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b px-5 py-3">
                    <h3 className="text-lg font-semibold text-gray-800">Share Translation</h3>
                    <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-gray-700">✖</button>
                  </div>
                  <div className="p-5 space-y-3">
                    {Object.entries(getShareLinks()).map(([platform, url]) => (
                      <button key={platform} onClick={() => window.open(url, "_blank")} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base">
                        Share via {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end border-t px-5 py-3">
                    <button onClick={() => setShowShareModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm sm:text-base">Close</button>
                  </div>
                </div>
              </div>
            )}

            {/* Translate Buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={async () => {
                  if (!inputText.trim()) return toast.error('Please enter text to translate')
                  setLoading(true)
                  try {
                    const res = await dispatch(translateText(inputText, sourceLang, targetLang))
                    const translated = res?.msg?.translatedText ?? res?.translatedText ?? ''
                    setTranslatedText(translated)
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Translation failed')
                  } finally { setLoading(false) }
                }}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Translate
              </button>

              <button onClick={() => { navigator.clipboard?.writeText(translatedText); toast.success('Copied to clipboard') }} className="px-4 py-2 border rounded">Copy</button>
            </div>
          </div>

          {/* Extra Info */}
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
