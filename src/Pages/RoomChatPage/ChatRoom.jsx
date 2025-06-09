//ChatRoom.jsx

import React from 'react'
import ChatBox from './ChatBox'
import SendMessage from './SendMessage'

const ChatRoom = () => {
  return (
    <div className='w-full'>
        <ChatBox/>
        <SendMessage/>
    </div>
  )
}

export default ChatRoom