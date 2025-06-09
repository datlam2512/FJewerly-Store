import React, { useEffect, useState } from 'react';
import '../StaffStationPage/StaffStationPage.scss'
import { Card, Button, Tooltip, Spin, Modal, Input, Select, message, ConfigProvider, Form } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import staffStationkApi from '../../Services/api/staffStationApi';
import userkApi from '../../Services/api/UserApi';
import { jwtDecode } from 'jwt-decode';
const StaffStationPage = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState({});
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editStationName, setEditStationName] = useState('');
    const [editStationStaffId, setEditStationStaffId] = useState('');
    const [editingStationId, setEditingStationId] = useState(null);

    const [isAddStationModalVisible, setIsAddStationModalVisible] = useState(false);
    const [newStationName, setNewStationName] = useState('');
    const [selectedStaffForNewStation, setSelectedStaffForNewStation] = useState('');
    const [role, setRole] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.role);
        }
    }, []);

    const fetchData = async () => {
        try {
            const data = await staffStationkApi.getAllStation();
            const filteredStations = data.filter(station => station.staionName !== 'string');
            setStations(filteredStations);

            const usersList = await userkApi.getUserListApi();
            setUsers(usersList);
        } catch (err) {
            console.error("There was an error fetching data!", err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setNewStationName('');
        setSelectedStaffForNewStation('');
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openAddStationModal = () => {
        setIsAddStationModalVisible(true);
    };

    const handleAddStation = async () => {
        if (!newStationName.trim() || !selectedStaffForNewStation) {
            message.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        if (stations.some(station => station.staionName.toLowerCase() === newStationName.toLowerCase())) {
            message.error("Tên quầy đã tồn tại!");
            return;
        }

        const newStation = {
            staffId: selectedStaffForNewStation,
            staionName: newStationName
        };

        setAddLoading(true);
        try {
            await staffStationkApi.createStation(newStation);
            message.success("Thêm quầy thành công!");
            fetchData();
            resetForm();
            setIsAddStationModalVisible(false);
        } catch (error) {
            message.error("Có lỗi xảy ra khi thêm quầy. Vui lòng thử lại!");
        } finally {
            setAddLoading(false);
        }
    };

    const handleDelete = async (stationId) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn xóa quầy này?',
            okText: 'Có',
            cancelText: 'Không',
            onOk: async () => {
                setDeleteLoading(true);
                try {
                    await staffStationkApi.deleteStation(stationId);
                    message.success('Xóa quầy thành công!');
                    fetchData();
                } catch (error) {
                    message.error(`Có lỗi xảy ra khi xóa quầy. ${error.response?.data?.errors?.join(', ')}`);
                } finally {
                    setDeleteLoading(false);
                }
            }
        });
    };

    const handleCancelAddStation = () => {
        setNewStationName('');
        setSelectedStaffForNewStation('');
        setIsAddStationModalVisible(false);
    };

    const handleOpenModal = (staffId) => {
        const selectedUser = users.find(user => user.staffId === staffId);
        if (selectedUser) {
            setSelectedStaff(selectedUser);
            setIsModalVisible(true);
        } else {
            console.error("No matching staff found!");
        }
    };

    const openEditModal = (station) => {
        setEditStationName(station.staionName);
        setEditStationStaffId(station.staffId);
        setEditingStationId(station.stationId);
        setIsEditModalVisible(true);
    };

    const handleEditStation = async () => {
        if (!editStationName.trim() || !editStationStaffId) {
            message.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (stations.some(station => station.staionName.toLowerCase() === editStationName.toLowerCase() && station.stationId !== editingStationId)) {
            message.error("Tên quầy đã tồn tại!");
            return;
        }

        const updatedStation = {
            staffId: editStationStaffId,
            staionName: editStationName
        };

        setEditLoading(true);
        try {
            await staffStationkApi.updateStation(editingStationId, updatedStation);

            fetchData();
            setIsEditModalVisible(false);
            setEditStationName('');
            setEditStationStaffId('');
        } catch (error) {
            message.error("Có lỗi xảy ra khi chỉnh sửa quầy. Vui lòng thử lại!");
        } finally {
            setEditLoading(false);
            message.success("Chỉnh sửa quầy thành công!");
        }
    };

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
                    Input: {
                        activeShadow: "0 0 0 0 rgba(5, 145, 255, 0.1)"
                    },
                },
            }}
        >
            <div className='w-full flex justify-center'>
                <div className="w-10/12 p-8">
                    <Spin spinning={loading}>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-700">Quầy làm việc</h1>
                            {(role === "Admin" || role === "Manager") && (
                                <Button className="add-station-btn" type="primary" icon={<PlusOutlined />} onClick={openAddStationModal}>Thêm quầy</Button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stations.map(station => (
                                <Card
                                    key={station.stationId}
                                    className="relative bg-gray-200 text-black rounded-lg w-80 flex items-center justify-center hover:shadow-lg transition-shadow duration-200"
                                    style={{ height: '150px' }}
                                >
                                    <div className="flex items-center justify-center h-full text-2xl font-semibold">
                                        <span className="bg-gray-100 rounded-lg p-4">{station.staionName}</span>
                                    </div>
                                    <div className="flex items-center justify-center mt-2 text-lg text-gray-600">
                                        {users.find(user => user.staffId === station.staffId)?.fullName}
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-25">
                                        {(role === "Admin" || role === "Manager") && (
                                            <Tooltip title="Sửa">
                                                <Button icon={<EditOutlined />} shape="circle" className="mx-1" onClick={() => openEditModal(station)} loading={editLoading} />
                                            </Tooltip>
                                        )}

                                        <Tooltip title="Chi tiết">
                                            <Button icon={<InfoCircleOutlined />} shape="circle" className="mx-1" onClick={() => handleOpenModal(station.staffId)} />
                                        </Tooltip>
                                        {(role === "Admin" || role === "Manager") && (
                                            <Tooltip title="Sửa">
                                                <Tooltip title="Xóa">
                                                    <Button onClick={() => handleDelete(station.stationId)} icon={<DeleteOutlined />} shape="circle" className="mx-1" loading={deleteLoading} />
                                                </Tooltip>
                                            </Tooltip>
                                        )}

                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Spin>
                </div>
                <Modal
                    title="Thông tin nhân viên trực"
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    className="custom-modal"
                >
                    <div className="space-y-4 p-4">
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-500">Họ và Tên:</span>
                            <span className="font-semibold">{selectedStaff.fullName}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-500">Email:</span>
                            <span className="font-semibold">{selectedStaff.email}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-500">Số Điện Thoại:</span>
                            <span className="font-semibold">{selectedStaff.phoneNumber}</span>
                        </div>
                    </div>
                </Modal>
                <Modal
                    title="Thêm quầy mới"
                    visible={isAddStationModalVisible}
                    onOk={handleAddStation}
                    onCancel={handleCancelAddStation}
                    footer={null}
                    className="custom-modal"
                >
                    <div className="space-y-4 p-6">
                        <Input
                            placeholder="Tên quầy"
                            value={newStationName}
                            onChange={(e) => setNewStationName(e.target.value)}
                            className="input-custom"
                        />
                        <Select
                            placeholder="Chọn nhân viên"
                            value={selectedStaffForNewStation}
                            onChange={(value) => setSelectedStaffForNewStation(value)}
                            className="select-custom w-full"
                            defaultValue=""
                        >
                            <Select.Option value="" disabled>Chọn nhân viên</Select.Option>
                            {users.filter(user => user.roleId === 2 && !stations.some(station => station.staffId === user.staffId)).map((user) => (
                                <Select.Option key={user.staffId} value={user.staffId}>
                                    {user.fullName}
                                </Select.Option>
                            ))}
                        </Select>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button onClick={handleCancelAddStation} className="btn-cancel">Hủy</Button>
                            <Button type="primary" onClick={handleAddStation} className="btn-ok" loading={addLoading}>Thêm</Button>
                        </div>
                    </div>
                </Modal>
                <Modal
                    title="Chỉnh sửa quầy"
                    visible={isEditModalVisible}
                    onOk={handleEditStation}
                    onCancel={() => setIsEditModalVisible(false)}
                    footer={null}
                    className="custom-modal"
                >
                    <div className="space-y-4 p-6">
                        <Input
                            id='input-staff'
                            placeholder="Tên quầy"
                            value={editStationName}
                            onChange={(e) => setEditStationName(e.target.value)}
                            className="input-custom"
                        />
                        <Select
                            placeholder="Chọn nhân viên"
                            value={editStationStaffId}
                            onChange={(value) => setEditStationStaffId(value)}
                            className="select-custom w-full"
                        >
                            {users.filter(user => user.roleId === 2 && (!stations.some(station => station.staffId === user.staffId) || user.staffId === editStationStaffId)).map((user) => (
                                <Select.Option key={user.staffId} value={user.staffId}>
                                    {user.fullName}
                                </Select.Option>
                            ))}
                        </Select>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button onClick={() => setIsEditModalVisible(false)} className="btn-cancel">Hủy</Button>
                            <Button type="primary" onClick={handleEditStation} className="btn-ok" loading={editLoading}>Lưu</Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </ConfigProvider>
    );
};

export default StaffStationPage;
