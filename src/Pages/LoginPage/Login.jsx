import React, { useEffect, useState } from "react";
import { Button, ConfigProvider, Form, Input, Spin, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../Services/api/loginApi";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { token } = await loginUser(values.email, values.password);
      if (token) {
        const decodedToken = jwtDecode(token);
        localStorage.setItem("nameid", decodedToken.nameid);
        localStorage.setItem("role", decodedToken.role);
        localStorage.setItem("email", decodedToken.email);
        localStorage.setItem("UserName", decodedToken.UserName);
        localStorage.setItem("UniqueName", decodedToken.unique_name);

        if (decodedToken.role === "Staff") {
          navigate("/sales-page");
        } else {
          navigate("/dashboard");
        }
      } else {
        message.error("Sai Email và mật khẩu! vui lòng thử lại");
      }
    } catch (error) {
      console.error("Error during login:", error);
      message.error("Xảy ra lỗi. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(-1);
    }
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "var(--primary-color)",
          colorPrimaryHover: "var(--primary-color-hover)"
        },
        components: {
          Input: {
            activeShadow: "0 0 0 0 rgba(5, 145, 255, 0.1)"
          },
        },
      }}
    >
      <Spin spinning={loading} size="large">
        <div className="login-container">
          <div className="login-bg">
            <img
              src="/login-bg(4).jpg"
              alt="Login theme"
            />
          </div>
          <div className="login-content">
            <div className="login-title">
              <h3 className="font-bold text-black">ĐĂNG NHẬP</h3>

            </div>

            <Form
              className="login-form"
              name="normal_login"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                className="login-label"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Vui Lòng nhập email của bạn",
                  },
                ]}
              >
                <Input
                  className="login-input"
                  prefix={<UserOutlined />}
                  placeholder="Email"
                  type="email"
                  autoFocus
                  maxLength={40}
                />
              </Form.Item>
              <Form.Item
                className="login-label"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu của bạn",
                  },
                ]}
              >
                <Input.Password
                  className="login-input"
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Mật khẩu"
                  maxLength={12}
                />
              </Form.Item>
              <Form.Item className="login-label">
                <Button
                  style={{ marginTop: "28px", height: "48px" }}
                  className="login-input"
                  type="primary"
                  block
                  htmlType="submit"
                >
                  ĐĂNG NHẬP
                </Button>
              </Form.Item>
            </Form>

          </div>
        </div>
      </Spin>
    </ConfigProvider>
  );
};

export default Login;
