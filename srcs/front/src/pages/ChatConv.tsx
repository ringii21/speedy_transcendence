import React, { useEffect } from 'react'
import { ChatProfil } from '../components/chatProfil'
import { useAuth } from '../providers/AuthProvider'
import { ChatBubble } from '../components/chatBubble'
import { WithNavbar } from '../hoc/WithNavbar'
import { IMessage } from '../types/Message'
import { useState } from 'react'
import { ChatContact } from '../components/ChatContact'
import { IUser } from '../types/User'
import { FindFriends } from '../components/FindFriends'
import { useNavigate } from 'react-router-dom'
import { ChatFriend } from '../components/ChatFriend'
import { FakeUsers } from '../types/FakeUser'

const ChatConv: React.FC = () => {
  const { user } = useAuth()
  const [inputMessage, setInputMessage] = useState<string>('')
  const [users] = useState<IUser>()
  const [messages, setMessage] = useState<IMessage[]>([])
  const [redirected, setRedirected] = useState(false)
  // const newMessage: IMessage = {
  //   author: {
  //     username: user?.username,
  //   },
  //   createdAt: new Date(),
  //   content: inputMessage,
  // }
  // const handleSendMessage = () => {
  //   if (inputMessage.trim() !== '') {
  //     setMessage([...messages, newMessage])
  //     setInputMessage('')
  //   }
  // }
  // const userInfo = {
  //   id: user?.id,
  //   name: user?.username,
  //   img: user?.image,
  // }
  // const handleKeyDown = (e: any) => {
  //   if (e.key === 'Enter') {
  //     handleSendMessage()
  //   }
  // }

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

  const [selectedUser, setSelectedUser] = useState<Partial<IUser> | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<Partial<
    IUser & Partial<IMessage[]>
  > | null>(null)
  const isFriend = data.find((u) => u.id === user?.id)
  const navigate = useNavigate()
  useEffect(() => {
    if (!redirected && selectedUser) {
      navigate(`/profil/${selectedUser.id}`)
      setRedirected(true)
    }
  }, [selectedUser, navigate, redirected])
  return (
    <div className="flex bg-white px-2 h-full">
      <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
        <FindFriends />
        {data.map((dt) => (
          <div key={dt.id}>
            <ChatContact
              data={dt}
              key={dt.id}
              setSelectedUser={setSelectedUser}
              setSelectUserMessage={setSelectedMessage}
            />
          </div>
        ))}
      </div>
      <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col">
        <div className="flex sm:items-center py-3 border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            {isFriend && <ChatProfil />}
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
        <ChatFriend />
      </div>
    </div>
  )
}

const ChatWithNavbar = WithNavbar(ChatConv)

export { ChatWithNavbar }
