import React from 'react'
import Navbar from '../components/Navbar'
import { FaLinkedin, FaGithub } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              About Translator
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Your intelligent companion for seamless language translation and communication
            </p>
          </div>

          {/* Features Grid */}
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Real-time Translation */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-2xl text-blue-600 mb-4">🔄</div>
                <h3 className="text-lg font-medium text-gray-900">Real-time Translation</h3>
                <p className="mt-2 text-gray-500">
                  Experience instant translations across multiple languages with high accuracy and natural results.
                </p>
              </div>

              {/* Smart Bookmarking */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-2xl text-blue-600 mb-4">🔖</div>
                <h3 className="text-lg font-medium text-gray-900">Smart Bookmarking</h3>
                <p className="mt-2 text-gray-500">
                  Save and organize your important translations for quick future reference.
                </p>
              </div>

              {/* Chat History */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-2xl text-blue-600 mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900">Translation History</h3>
                <p className="mt-2 text-gray-500">
                  Access your past translations anytime, making it easy to track and revisit previous work.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              How It Works
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <ol className="space-y-6">
                <li className="flex items-start">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-medium mr-4">1</span>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Select Languages</h4>
                    <p className="mt-1 text-gray-500">Choose your source and target languages from our wide selection.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-medium mr-4">2</span>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Enter Text</h4>
                    <p className="mt-1 text-gray-500">Type or paste the text you want to translate.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-medium mr-4">3</span>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Get Translation</h4>
                    <p className="mt-1 text-gray-500">Receive your accurate translation instantly and copy or save it for later use.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* 👨 About Me Section */}
          <div className="mt-20 flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg p-8">
            <div className="w-32 h-32 mb-6 md:mb-0 md:mr-8">
              <img
                src="/imgs/boss.jpg" // 👈 replace with your image path
                alt="My Photo"
                className="w-full h-full rounded-full object-cover shadow-md"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Hi, I'm Kunal Patel 👋</h2>
              <p className="text-gray-600 max-w-xl">
                I'm a passionate web developer and the creator of this Translator app. 
                My goal is to build tools that make communication across languages easy, 
                fast, and accessible for everyone. I love working with modern web technologies, 
                exploring new ideas, and turning them into real projects.
              </p>
              <p className="mt-3 text-gray-500">
                💻 Tech Stack: React · Node.js · Express · MongoDB
              </p>
            </div>
          </div>

          {/* 🌐 Contact for Collaboration Section */}
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🤝 Let's Collaborate</h2>
            <p className="text-gray-600 mb-6">
              I'm always open to new projects, ideas, and collaborations. <br />
              Connect with me on my professional networks:
            </p>
            <div className="flex justify-center space-x-6">
              {/* LinkedIn Button */}
              <a
                href="https://www.linkedin.com/in/kunal-patel-020b19285/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                <FaLinkedin className="mr-2 text-xl" />
                LinkedIn
              </a>

              {/* GitHub Button */}
              <a
                href="https://github.com/kunalsingh7053"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900 transition"
              >
                <FaGithub className="mr-2 text-xl" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
