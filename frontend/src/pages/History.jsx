import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { clearMessages, removeMessage } from '../features/reducers/msgSlice';
import { toast } from 'react-toastify';
import API from '../api/axios'; // axios instance

const History = () => {
  const dispatch = useDispatch();
  const currentMessages = useSelector((state) => state.msg?.messages || []);

  const [allHistory, setAllHistory] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);

  // Copy text to clipboard
  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    toast.success('Copied to clipboard');
  };

  // Delete single message from Redux (session only)
  const handleDelete = (id) => {
    dispatch(removeMessage(id));
    toast.success('Deleted from session');
  };

  // Clear all messages from Redux (session)
  const handleClear = () => {
    dispatch(clearMessages());
    toast.success('Cleared current session');
  };

  // Fetch all-time history from backend
  const fetchAllHistory = async () => {
    try {
      setLoadingAll(true);
      const res = await API.get('/translator/history');
      if (res.data.success) {
        setAllHistory(res.data.history);
      }
    } catch (error) {
      console.error('❌ Error fetching history:', error);
      toast.error('Failed to load all history');
    } finally {
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    fetchAllHistory();
  }, []);

  // Delete a single chat from backend (permanently)
  const handleDeleteBackend = async (id) => {
    try {
      const res = await API.delete(`/translator/history/${id}`);
      if (res.data.success) {
        setAllHistory(allHistory.filter((m) => m._id !== id));
        toast.success('Deleted permanently');
      }
    } catch (error) {
      console.error('❌ Delete failed:', error);
      toast.error('Failed to delete');
    }
  };

  // Delete all chat messages from backend (permanently)
  const handleClearAllBackend = async () => {
    if (!window.confirm('Are you sure you want to delete ALL chat history?')) return;
    try {
      const res = await API.delete('/translator/history');
      if (res.data.success) {
        setAllHistory([]);
        toast.success('All chat history deleted permanently');
      }
    } catch (error) {
      console.error('❌ Failed to clear all chats:', error);
      toast.error('Failed to clear all chat history');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Translation History</h1>

        {/* ---------- Current Session ---------- */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Current Session</h2>
            <button
              onClick={handleClear}
              className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
            >
              Clear All
            </button>
          </div>

          {currentMessages.length === 0 ? (
            <div className="p-4 bg-white rounded shadow text-gray-500">
              No translations in this session.
            </div>
          ) : (
            currentMessages
              .slice()
              .reverse()
              .map((m) => (
                <div
                  key={m.id}
                  className="bg-white p-4 rounded shadow mb-2 flex justify-between"
                >
                  <div>
                    <p>
                      <strong>Input:</strong> {m.input}
                    </p>
                    <p>
                      <strong>Output:</strong> {m.output}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(m.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleCopy(m.output)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* ---------- All-Time History ---------- */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All-time History</h2>
            <button
              onClick={handleClearAllBackend}
              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Clear All Chat
            </button>
          </div>

          {loadingAll ? (
            <p>Loading all history...</p>
          ) : allHistory.length === 0 ? (
            <div className="p-4 bg-white rounded shadow text-gray-500">
              No saved translations.
            </div>
          ) : (
            allHistory.map((m) => (
              <div
                key={m._id}
                className="bg-white p-4 rounded shadow mb-2 flex justify-between"
              >
                <div>
                  <p>
                    <strong>Input:</strong> {m.originalText}
                  </p>
                  <p>
                    <strong>Output:</strong> {m.translatedText}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleCopy(m.translatedText)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleDeleteBackend(m._id)}
                    className="px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
