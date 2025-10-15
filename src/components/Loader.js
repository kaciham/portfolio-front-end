import React from 'react'

const Loader = ({ type = 'default', size = 'medium', color = 'blue' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    white: 'border-white',
    gray: 'border-gray-500'
  };

  if (type === 'spinner') {
    return (
      <div className="flex justify-center items-center">
        <div className={`${sizeClasses[size]} border-4 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}></div>
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className="flex justify-center items-center space-x-2">
        <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
        <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
        <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className="flex justify-center items-center">
        <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-pulse`}></div>
      </div>
    );
  }

  // Default loader (enhanced version of original)
  return (
    <div className="flex justify-center items-center">
      <div className="loader-container">
        <div className="loader-dots">
          <div></div><div></div><div></div><div></div><div></div>
          <div></div><div></div><div></div><div></div><div></div>
          <div></div><div></div><div></div>
        </div>
      </div>
    </div>
  )
}

export default Loader;