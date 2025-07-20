import React, { useState, useEffect } from 'react'

const ServiceDownPopUp = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Show the notification after a small delay when component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
    }, 300)
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  if (!isVisible) return null

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-2xl max-w-sm mx-auto transform transition-all duration-500 ease-out ${
      isClosing ? 'translate-y-[-120%] opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'
    } ${
      isVisible ? 'animate-slide-in' : ''
    }`}>
      <div className="relative p-4">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-start space-x-3 pr-6">
          {/* Icon */}
          <div className="flex-shrink-0 mt-1">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100">
              <svg className="h-4 w-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-gray-900">
                Under Maintenance
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Working on improvements! 
            </p>
            
            {/* Action buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                className="flex-1 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200"
              >
                Refresh
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateY(-100%) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  )
}

export default ServiceDownPopUp