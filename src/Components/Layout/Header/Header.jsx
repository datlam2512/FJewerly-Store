import React, { useEffect, useState } from 'react';
import { BellFilled } from "@ant-design/icons";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { Avatar, Badge, Button, Modal, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../../../context/ThemeContext';
import { db } from '../../../Pages/firebase/ChatRoomFirebase';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import "./Header.scss";

function Header() {
  const navigate = useNavigate();
  const uniqueName = localStorage.getItem('UniqueName');
  const initial = uniqueName ? uniqueName.charAt(0).toUpperCase() : '';
  const [showName, setShowName] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [discountMessages, setDiscountMessages] = useState([]);
  const [hasNewDiscount, setHasNewDiscount] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"), limit(50));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const discountMessagesArray = [];
      let newDiscountFound = false;
      querySnapshot.forEach((doc) => {
        const message = doc.data();
        if (message.type === "discount") {
          discountMessagesArray.push({ ...doc.data(), id: doc.id });
          newDiscountFound = true;
        }
      });
      const reversedMessages = discountMessagesArray.reverse();
      setDiscountMessages(reversedMessages);
      setHasNewDiscount(newDiscountFound);
    });

    return () => unsubscribe();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
    setHasNewDiscount(false);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const toggleShowName = () => {
    setShowName(!showName);
  };

  return (
    <header className={`header ${isDarkMode ? 'dark-mode' : 'bright-mode'}`}>
      <div className="logo" />
      <div className="body">
        <div className="user flex">
          <Badge dot={hasNewDiscount} offset={[-2, 2]} className=' mr-8'>
            <BellFilled
              className="text-white text-2xl cursor-pointer"
              onClick={showModal}
            />
          </Badge>
          <Modal title="Thông báo" visible={isModalVisible} onOk={handleOk} onCancel={handleOk}>
            <div className="max-h-96 overflow-y-auto">
              {discountMessages.map((message) => (
                <div key={message.id} className="border-b border-gray-300 py-2">
                  <div dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br>') }} />
                  <p>{message.createdAt ? format(message.createdAt.toDate(), "dd/MM/yyyy HH:mm", { locale: vi }) : ''}</p>
                </div>
              ))}
            </div>
          </Modal>
          <div className="flex items-center">
            <p style={{ paddingRight: '25px' }}>Xin chào, {uniqueName}</p>
          </div>
          <div className="relative">
            <Avatar
              size={"large"}
              style={{
                color: "#2d3748",
                fontWeight: "bolder",
                backgroundColor: "#EDF2F7",
                verticalAlign: 'middle',
                display: "flex",
                alignItems: "center",
                cursor: "pointer"
              }}
              onClick={toggleShowName}
            >
              {initial}
            </Avatar>
            {showName && (
              <div className="absolute right-0 mt-2 p-2 bg-white border border-gray-300 rounded shadow-lg whitespace-nowrap">
                <p className="text-[small] text-gray-700 font-semibold">{uniqueName}</p>
              </div>
            )}
          </div>
          <Switch
            checkedChildren="Tối"
            unCheckedChildren="Sáng"
            checked={isDarkMode}
            onChange={toggleTheme}
            style={{ marginRight: '10px' }}
            className='ml-6'
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
