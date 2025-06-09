import { useState } from 'react';
import { Link } from 'react-router-dom';
import "./NavItem.scss";
import { DownOutlined, LeftOutlined } from '@ant-design/icons';

function NavItem(props) {
    const [showSubNav, setShowSubNav] = useState(false);

    // Kiểm tra xem children có tồn tại và là một mảng trước khi truy cập vào length
    const childrenExistAndIsArray = Array.isArray(props.children) ? props.children : [];

    return (
        <div className={`${props.display}`}>
            {props.to !== "" ?
                <Link
                    className="nav-item"
                    to={props.to}
                    onClick={() => setShowSubNav(!showSubNav)}
                >
                    <div className={props.collapsed ? "icon" : ""}>{props.icon}</div>
                    {!props.collapsed &&
                        (
                            <>
                                <div className="title">{props.title}</div>
                                {childrenExistAndIsArray.length > 0 ?
                                    (<div style={{ paddingRight: "15px" }}>
                                        {showSubNav ? <DownOutlined /> : <LeftOutlined />}
                                    </div>) : ""}
                            </>
                        )}
                </Link>
                :
                <div
                    className="nav-item"
                    onClick={() => setShowSubNav(!showSubNav)}
                >
                    <div className={props.collapsed ? "icon" : ""} style={{ display: "flex", alignItems: "center" }}>{props.icon}</div>
                    {!props.collapsed &&
                        (
                            <>
                                <div className="title">{props.title}</div>
                                {childrenExistAndIsArray.length > 0 ?
                                    (<div>{showSubNav ? <DownOutlined /> : <LeftOutlined />}</div>) : ""}
                            </>
                        )}
                </div>
            }
            {(childrenExistAndIsArray.length > 0 && showSubNav === true && !props.collapsed) &&
                (
                    <>
                        {childrenExistAndIsArray.map(child => (
                            <Link
                                className="sub-nav"
                                key={child.title}
                                to={child.to !== "" && child.to}
                            >
                                {child.title}
                            </Link>
                        ))}
                    </>
                )}
        </div>
    );
}

export default NavItem;