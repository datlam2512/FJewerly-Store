import Sider from 'antd/es/layout/Sider';
import { useEffect, useState } from 'react';
import { decrypt } from '../../../Utils/crypto';
import "./Sidebar.scss"
import NavItem from './NavItem/NavItem';
import { CloseOutlined, MenuOutlined, SearchOutlined, DollarOutlined, AppstoreOutlined, InboxOutlined, LineChartOutlined, SettingOutlined, UserOutlined, PercentageOutlined, LogoutOutlined, ScheduleOutlined, CommentOutlined } from '@ant-design/icons';
import Search from 'antd/es/transfer/search';
import { strings_vi } from '../../../Services/languages/displaystrings';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../Pages/firebase/ChatRoomFirebase'

function Sidebar() {
  const location = useLocation();
  const [showNotification, setShowNotification] = useState(false);

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState(false);
  const authToken = localStorage.getItem('token');
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      setRole(decodedToken.role);
    }

    // Theo dõi tin nhắn mới từ Firebase
    const q = collection(db, "messages");
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let hasNewMessage = false;
      querySnapshot.forEach((doc) => {
        if (doc.data().type === 'message') {
          hasNewMessage = true;
        }
      });
      // Hiển thị thông báo nếu người dùng không đang ở trang trò chuyện
      if (location.pathname !== '/chat-room') {
        setShowNotification(hasNewMessage);
      }
    });

    return () => unsubscribe();
  }, [authToken, location.pathname]);


  const strSidebar = strings_vi.SideBar;
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleChatClick = () => {
    setNewMessage(false);
    setShowNotification(false); // Xóa thông báo khi người dùng nhấp vào
    navigate('/chat-room');
  };

  const navItems = [
    role === "Admin" || role === "Manager" ? {
      icon: <LineChartOutlined style={{ fontSize: "16px" }} />,
      title: strSidebar.Overview,
      to: '/dashboard',
    } :
      {
        display: "hidden"
      }
    ,
    {
      icon: <DollarOutlined style={{ fontSize: "16px" }} />,
      title: strSidebar.Payment,
      to: "",
      children: [
        {
          title: strSidebar.Buy,
          to: '/buy-back-page',
        },
        {
          title: strSidebar.Sell,
          to: '/sales-page',
        },
      ],
    },
    {
      icon: <AppstoreOutlined style={{ fontSize: "16px" }} />,
      title: strSidebar.Products,
      to: "/product",

    },
    {
      icon: <InboxOutlined style={{ fontSize: "16px" }} />,
      title: 'Đơn hàng',
      to: "/orders",

    },

    role === "Admin" || role === "Manager" ? {
      icon: <PercentageOutlined style={{ fontSize: "16px" }} />,
      title: 'Khuyến mãi',
      to: "/promotion",

    } :
      {
        display: "hidden"
      }
    ,

    role === "Admin" || role === "Staff" ? {
      icon: <SearchOutlined style={{ fontSize: "16px" }} />,
      title: strSidebar.SearchProfile,
      to: "/customer-search",

    } :
      {
        display: "hidden"
      },
    role === "Admin" ? {
      icon: <UserOutlined style={{ fontSize: "16px" }} />,
      title: 'Nhân sự',
      to: "/user",

    } :
      {
        display: "hidden"
      },
    role === "Admin" || role === "Manager" ? {
      icon: <ScheduleOutlined style={{ fontSize: "16px" }} />,
      title: 'Quầy',
      to: "/station",
    } :
      {
        display: "hidden"
      },
{
      icon: (
        <div style={{ position: 'relative' }}>
          <CommentOutlined style={{ fontSize: "16px" }} />
          {newMessage && (
            <span
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'red',
              }}
            />
          )}
        </div>
      ),
      title: 'Giao Tiếp',
      to: "/chat-room",
      onClick: handleChatClick

    },
    {
      icon: <SettingOutlined style={{ fontSize: "16px" }} />,
      title: strSidebar.Setting,
      to: "",
      children: [
        {
          title: strSidebar.GoldPrice,
          to: '/exchange-rate',
        }
      ],
    },
  ];

  return (
    <Sider
      id='sidebar'
      className='sidebar text-black'
      collapsed={collapsed}
      theme='light'
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        borderLeft: "2px solid black"
      }}
    >
      <div
        className={collapsed ? 'close' : 'open'}
        onClick={() => {
          setCollapsed(!collapsed);
        }}
      >
        {collapsed ? <MenuOutlined /> : <CloseOutlined style={{ paddingRight: "10px" }} />}
      </div>
      {navItems.map((item) => (
        <NavItem
          key={item.title}
          icon={item.icon}
          title={item.title}
          to={item.to}
          children={item.children}
          collapsed={collapsed}
          display={item.display}
        />
      ))}
      <div className='text-black flex mt-[30%] mx-[5%] mb-[0] pt-[5px] pb-[5px] rounded-[5px] [transition:0.3] hover:bg-[rgb(246,_246,_246)]'>
        <p className="mr-3"><LogoutOutlined style={{ fontSize: "14px" }} /></p>
        <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
      </div>
    </Sider>
  );
}

export default Sidebar;
