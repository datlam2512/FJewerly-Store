import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { db } from '../firebase/ChatRoomFirebase';
import { message } from 'antd';

const SendMessage = () => {
    const [value, setValue] = useState("");
    const uniqueName = localStorage.getItem('UniqueName');
    const role = localStorage.getItem("role");
    const messageTimeout = 3000;
    let lastMessageTime = null;
    const showMessageError = (messageText) => {
      const now = Date.now();
      if (!lastMessageTime || now - lastMessageTime > messageTimeout) {
        message.error(messageText);
        lastMessageTime = now;
      }
    };
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if(value.trim() === ""){
          showMessageError("Vui lòng nhập nội dung!");
          return;
        }
        try {
          await addDoc(collection(db, "messages"), {
            text: value,
            name: uniqueName,
            role: role,
            type: "message",
            createdAt: serverTimestamp(),
          })
        } catch(error) {
          console.log(error);
        }
        setValue("");
    }

  return (
    <div className='bg-gray-200 fixed bottom-0 w-full py-10 shadow-lg pl-10 '>
        <form onSubmit={handleSendMessage} className='w-3/4 ml-12 flex'>
            <input value={value} onChange={e => setValue(e.target.value)} 
            className='input text-black w-full 
                        focus:outline-none bg-gray-100 rounded-r-none' type='text'/>
            <button type="submit" className='w-auto bg-gray-500 text-white rounded-r-lg px-5 text-sm'>Gửi</button>
        </form>
    </div>
  )
}

export default SendMessage