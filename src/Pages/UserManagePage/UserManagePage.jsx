import React, { useState, useEffect } from "react";
import { Input, Table, Space, Button, Modal, message, Form, Select, Statistic, Card, Row, Col, ConfigProvider, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import './UserManagePage.scss';
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../Features/User/userListSlice";
import { addUser } from "../../Features/User/userAddSlice";
import { deleteUser } from "../../Features/User/userdeleteSlice";
import { editUser } from "../../Features/User/userEditSlice";

export default function UserManagePage() {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const isLoading = useSelector((state) => state.user.isLoading);
  const editLoading = useSelector((state) => state.userEdit.loading);
  const editError = useSelector((state) => state.userEdit.error);
  const editSuccess = useSelector((state) => state.userEdit.success);
  const [selectedUser, setSelectedUser] = useState(null);
  const numManagers = userData.filter(user => user.roleId === 1).length;
  const numStaff = userData.filter(user => user.roleId === 2).length;
  const numActive = userData.filter(user => user.status && user.status.toLowerCase() === "active").length;
  const numInactive = userData.filter(user => user.status && user.status.toLowerCase() === "inactive").length;

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const handleEditOk = () => {
    editForm
      .validateFields()
      .then((values) => {
        dispatch(editUser({ staffId: selectedUser.staffId, userdetail: values }))
          .then(() => {
            message.success("Cập nhật nhân viên thành công");
            dispatch(fetchUserData());
            editForm.resetFields();
          })
          .catch((error) => {
            message.error("Cập nhật nhân viên thất bại");
          });
        setIsEditModalOpen(false);
      })
      .catch((errorInfo) => {
        console.log("Xác thực thất bại:", errorInfo);
      });
  };

  const showEditModal = (user) => {
    setSelectedUser(user);
    editForm.setFieldsValue({
      fullName: user.fullName,
      email: user.email,
      address: user.address,
      phoneNumber: user.phoneNumber,
      status: user.status,
      roleId: user.roleId,
      passwordHash: "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
  };

  const handleDelete = (staffId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa nhân viên này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        dispatch(deleteUser(staffId))
          .then(() => {
            message.success("Xóa nhân viên thành công");
            dispatch(fetchUserData());
          })
          .catch((error) => {
            message.error("Xóa nhân viên thất bại");
          });
      },
    });
  };

  const getRoleNameById = (roleId) => {
    switch (roleId) {
      case 0:
        return "Admin";
      case 1:
        return "Manager";
      case 2:
        return "Staff";
      default:
        return "Unknown";
    }
  };

  const handleAddCancel = () => {
    setAddModalVisible(false);
    addForm.resetFields();
  };

  const handleAddOk = () => {
    addForm
      .validateFields()
      .then((values) => {
        const newUser = {
          roleId: values.role,
          stationId: "01",
          fullName: values.fullName,
          userName: values.email,
          passwordHash: values.passwordHash,
          address: values.address,
          phoneNumber: values.phoneNumber,
          gender: values.gender,
          status: "Active",
          email: values.email,
        };
        dispatch(addUser(newUser))
          .then(() => {
            dispatch(fetchUserData());
            addForm.resetFields();
            message.success("Thêm nhân viên thành công");
          })
          .catch((error) => {
            message.error("Thêm sản phẩm thất bại");
          });
        setAddModalVisible(false);
      })
      .catch((errorInfo) => {
        console.log("xác thực thất bại:", errorInfo);
      });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: 'key',
      key: 'key',
      width: 50,
    },
    {
      title: "Mã",
      dataIndex: "staffId",
      key: 'staffId',
      width: 120,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "fullName",
      key: 'fullName',
      width: 150,
    },
    {
      title: "Vai trò",
      dataIndex: "roleId",
      key: 'roleId',
      render: (roleId) => getRoleNameById(roleId)
    },
    {
      title: "Email",
      dataIndex: "email",
      key: 'email'
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: 'address',
      width: 550,
      class: "[word-wrap:break-word]"
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: 'phoneNumber'
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        text && text.toLowerCase() === "active" ?
          <Tag color="green">Active</Tag> :
          <Tag color="red">Inactive</Tag>
      )
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => showEditModal(record)} />
          <DeleteOutlined onClick={() => handleDelete(record.staffId)} />
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "var(--primary-color)",
          colorPrimaryHover: "var(--primary-color-hover)"
        },
        components: {
          Select: {
            optionSelectedBg: "#dbdbdb"
          },
        },
      }}
    >
      <div className="user-manage-page">
        <div className="statistics-section">
          <Row className="statistics-box" justify="center" gutter={16}>
            <Col span={6} style={{ wordWrap: "break-word" }}>
              <Card >
                <Statistic
                  title="Managers"
                  value={numManagers}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Staff"
                  value={numStaff}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={<span className="active-title">Active</span>}
                  value={numActive}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={<span className="inactive-title">Inactive</span>}
                  value={numInactive}
                />
              </Card>
            </Col>
          </Row>
        </div>
        <div className="my-1 w-screen lg:w-full p-4">
          <div className="h-[40%] min-h-[485px] w-full lg:w-full text-center p-3 bg-[#FFFFFF] rounded-[7px] shadow-md">
            <div className="flex justify-between">
              <div className="w-[86%] flex justify-start">
                <Input className="search-input"
                  style={{ width: "89.7%", marginBottom: "5px" }}
                  placeholder="Search by name or email"
                  value={searchValue}
                  onChange={async event => { setSearchValue(event.target.value); }}
                  allowClear
                />
                <Button
                  type="primary"
                  className="search-btn ml-2"
                  style={{ fontWeight: "600", heigh: "30px", width: "9.6%" }}
                  loading={loading}>
                  Tìm kiếm
                </Button>
              </div>
              <div className="w-[11%]">
                <Button
                  onClick={() => setAddModalVisible(true)}
                  type="primary"
                  className="add-user-btn"
                >
                  Thêm nhân viên
                </Button>
              </div>
            </div>
            <div className="overflow-scroll">
              <Table
                columns={columns}
                dataSource={userData.filter(user =>
                  user.fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchValue.toLowerCase())
                ).map((user, index) => ({
                  ...user,
                  key: index + 1,
                }))}
                loading={isLoading}
                rowKey="staffId"
              />
            </div>
          </div>
        </div>

        <Modal
          title="Edit User"
          visible={isEditModalOpen}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
          confirmLoading={editLoading}
        >
          <Form form={editForm} layout="vertical" initialValues={selectedUser}>
            <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: "Please enter the full name" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please enter the email" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Address" rules={[{ required: true, message: "Please enter the address" }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Vai trò"
              name="roleId"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            >
              <Select placeholder="Chọn vai trò">
                <Select.Option value={0}>Admin</Select.Option>
                <Select.Option value={1}>Manager</Select.Option>
                <Select.Option value={2}>Staff</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true, message: "Please enter the phone number" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select the status" }]}>
              <Select>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="passwordHash"
              rules={[
                {message: 'Vui lòng nhập mật khẩu' },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

          </Form>
        </Modal>

        <Modal
          title="Thêm nhân viên"
          visible={isAddModalVisible}
          onCancel={handleAddCancel}
          footer={
            <div className="text-right">
              <Button onClick={handleAddCancel} className="mr-3">
                Hủy
              </Button>
              <Button onClick={handleAddOk} type="primary">
                Xác nhận
              </Button>
            </div>
          }
        >
          <Form form={addForm} layout="vertical">
            <Form.Item
              label="Tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập Email!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            >
              <Select placeholder="Chọn vai trò">
                <Select.Option value={0}>Admin</Select.Option>
                <Select.Option value={1}>Manager</Select.Option>
                <Select.Option value={2}>Staff</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select placeholder="Chọn giới tính">
                <Select.Option value="Male">Nam</Select.Option>
                <Select.Option value="Female">Nữ</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="passwordHash"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
}
