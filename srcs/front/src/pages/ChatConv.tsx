import React, { useEffect } from 'react'
import { ChatProfil } from '../components/chatProfil'
import { useAuth } from '../providers/AuthProvider'
import { ChatBubble } from '../components/chatBubble'
import { WithNavbar } from '../hoc/WithNavbar'
import { IMessage } from '../types/Message'
import { useState } from 'react'
import { ChatContact } from '../components/ChatContact'
import { IUser } from '../types/User'

const ChatConv = () => {
  const { user } = useAuth()
  const [inputMessage, setInputMessage] = useState<string>('')
  const [messages, setMessage] = useState<IMessage[]>([])
  const [selectedUser, setSelectedUser] = useState<string>('')
  const newMessage: IMessage = {
    author: {
      username: user?.username,
    },
    createdAt: new Date(),
    content: inputMessage,
  }
  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessage([...messages, newMessage])
      setInputMessage('')
    }
  }
  const userInfo = {
    id: user?.id,
    name: user?.username,
    img: user?.image,
  }
  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }
  const data: Partial<IUser & { messages: Partial<IMessage[]> }>[] = [
    {
      id: '2',
      image: 'https://i.pravatar.cc/150?img=2',
      email: '',
      username: 'yoyo',
      messages,
    },
    {
      id: '3',
      image: 'https://i.pravatar.cc/150?img=3',
      email: '',
      username: 'yoyo2',
      messages,
    },
  ]
  useEffect(() => {
    console.log(selectedUser)
  }, [selectedUser])
  return (
    <div className="flex bg-white px-2 h-full">
      <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
        {data.map((dt, i) => (
          <ChatContact data={dt} key={i} setSelectedUser={setSelectedUser} />
        ))}
      </div>
      <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col">
        <div className="flex sm:items-center py-3 border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            <ChatProfil name={userInfo.name} img={userInfo.img} />
          </div>
        </div>
        <div className="overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch h-screen bottom-0 h-full">
          <div id="messages" className="flex flex-col space-y-4 elliotp-3">
            {messages.map(
              (mymessage) =>
                user && (
                  <ChatBubble
                    key={mymessage.author.id}
                    message={mymessage}
                    user={user}
                  />
                ),
            )}
          </div>
        </div>
        <div className="border-t-2 border-gray-200 px-4 pt-12 mb-2 h-96">
          <div className="relative flex">
            <span className="absolute inset-y-0 flex items-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  ></path>
                </svg>
              </button>{' '}
            </span>
            <input
              type="text"
              value={inputMessage}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Write your message!"
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
            ></input>
            <div className="absolute right-1 items-center inset-y-1">
              <button
                type="button"
                onClick={handleSendMessage}
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 ransition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
              >
                <span className="font-bold">Send</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-6 w-6 ml-2 transform rotate-90"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ChatWithNavbar = WithNavbar(ChatConv)

export { ChatWithNavbar }
