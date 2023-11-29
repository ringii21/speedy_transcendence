import React from 'react'

function ChatProfil({
  name,
  img,
}: {
  name: string | undefined
  img: string | undefined
}) {
  return (
    <div className="relative">
      <img
        src={img}
        alt=""
        className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
      />
      <div className="flex flex-col leading-tight">
        <div className="text-2xl mt-1 flex items-center">
          <span className="text-gray-700 mr-8 bottom-0">{name}</span>
          <span className="absolute text-green-500 right-0 bottom-1">
            <svg width="20" height="20">
              <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

export { ChatProfil }
