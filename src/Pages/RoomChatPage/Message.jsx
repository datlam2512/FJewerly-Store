//Message.jsx

import React from "react";
import { format } from "date-fns";
import { vi } from 'date-fns/locale';

const Message = ({ message }) => {
  const uniqueName = localStorage.getItem('UniqueName');
  const messagePosition = message.name === uniqueName ? "chat-end" : "chat-start";
  const formattedDate = message.createdAt ? format(message.createdAt.toDate(), "dd/MM/yyyy HH:mm", { locale: vi }) : '';

  const getRoleColorClass = (role) => {
    switch (role) {
      case "admin":
        return "text-red-500";
      case "manager":
        return "text-blue-500";
      case "staff":
        return "text-green-500";
      default:
        return "text-black";
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "manager":
        return "Quản Lý";
      case "staff":
        return "Nhân Viên";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="w-full">
      <div className={`chat ${messagePosition} pl-35 ml-10 pr-10`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src={`${process.env.PUBLIC_URL}/avt-dang-iu.jpg`} alt="My Image" />
          </div>
        </div>
        <div className={`chat-header font-bold ${getRoleColorClass(message.role)}`}>
          {`${message.name} (${getRoleDisplayName(message.role)})`}
        </div>
        <div className="chat-bubble bg-white text-black">
        <div dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br>') }} />
        </div>
        <div className="text-gray-500 mt-2 text-xs">{formattedDate}</div> 
      </div>
    </div>
  );
};

export default Message;
