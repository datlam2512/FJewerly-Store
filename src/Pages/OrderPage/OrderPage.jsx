import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfigProvider, Modal, Spin, Table, Tag } from 'antd';
import { fetchAllOrder } from '../../Features/order/orderSlice';
import { fetchInvoiceById } from '../../Features/Invoice/invoiceByIdSlice';
import moment from 'moment';
import 'moment/locale/vi';

const OrderPage = () => {
    const dispatch = useDispatch();
    const allOrder = useSelector((state) => state.orders.allOrder);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { invoiceIdDetail, loading, error } = useSelector(state => state.invoiceById);
    const [tableLoading, setTableLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setTableLoading(true);
            await dispatch(fetchAllOrder());
            setTableLoading(false);
        };
        fetchData();
    }, [dispatch]);

    const showModal = async (id) => {
        await dispatch(fetchInvoiceById(id));
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'ID hóa đơn',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <a onClick={() => showModal(text)} className="text-blue-700 hover:text-gray-600">{text}</a>,
        },
        {
            title: 'Mã hóa đơn',
            dataIndex: 'invoiceNumber',
            key: 'invoiceNumber',
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentType',
            key: 'paymentType',
            sorter: (a, b) => a.paymentType.localeCompare(b.paymentType)
        },
        {
            title: 'Số lượng sản phẩm',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Tổng hóa đơn',
            dataIndex: 'subTotal',
            key: 'subTotal',
            render: (_, record) => {
                const formattedPrice = Number(record.subTotal).toLocaleString() + 'đ';
                return <span>{formattedPrice}</span>;
            },
        },
        {
            title: 'Loại hóa đơn',
            dataIndex: 'isBuyBack',
            key: 'isBuyBack',
            render: (isBuyBack) => (isBuyBack ? <Tag color="orange">Mua lại</Tag> : <Tag color="green">Bán ra</Tag>),
            sorter: (a, b) => (a.isBuyBack === b.isBuyBack ? 0 : a.isBuyBack ? -1 : 1),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (date) => <span>{moment(date).format('DD-MM-YYYY')}</span>,
            sorter: (a, b) => moment(a.createdDate).unix() - moment(b.createdDate).unix(),
            defaultSortOrder: 'descend',
        },
    ];

    const columnsDetail = [
        {
            title: 'Mã sản phẩm',
            dataIndex: 'itemId',
            key: 'itemId',
            width: 150,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: ['item', 'itemName'],
            key: 'itemName',
            width: 250,
        },
        {
            title: 'Loại phụ kiện',
            dataIndex: ['item', 'accessoryType'],
            key: 'accessoryType',
            width: 150,
        },
        {
            title: "Loại Vàng",
            dataIndex: "goldType",
            key: "goldType",
            width: 150,
            render: (_, record) => {
                let goldType = "";
                if (record.item.itemName.toLowerCase().includes("10k")) {
                    goldType = "10K";
                } else if (record.item.itemName.toLowerCase().includes("14k")) {
                    goldType = "14K";
                } else if (record.item.itemName.toLowerCase().includes("18k")) {
                    goldType = "18K";
                } else if (record.item.itemName.toLowerCase().includes("24k")) {
                    goldType = "24K";
                }
                return goldType;
            },
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
        },
        {
            title: "Trọng Lượng",
            dataIndex: ['item', 'weight'],
            key: "weight",
            width: 100,
        },
        {
            title: 'Giá thanh toán',
            dataIndex: 'price',
            key: 'price',
            width: 150,
            render: (_, record) => {
                const formattedPrice = Number(record.price).toLocaleString() + 'đ';
                return <span style={{ color: 'red' }}>{formattedPrice}</span>;
            },
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
                    Input: {
                        activeShadow: "0 0 0 0 rgba(5, 145, 255, 0.1)"
                    },
                },
            }}
        >
            <div className="container mx-auto mt-6">
                <h1 className="text-2xl font-bold mb-4 text-gray-800 ml-5">Đơn hàng</h1>
                <Table
                    dataSource={allOrder}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 12 }}
                    loading={tableLoading}
                    className="mb-6 font-medium"
                />
                <Modal
                    title="Chi tiết hóa đơn"
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleOk}
                    width="50%"
                >
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Spin className="text-gray-500" size="large" />
                        </div>
                    ) : invoiceIdDetail && invoiceIdDetail.data ? (
                        <Table
                            columns={columnsDetail}
                            dataSource={invoiceIdDetail.data}
                            rowKey="itemId"
                            pagination={false}
                            className="w-full rounded-[5px] font-medium"
                        />
                    ) : (
                        <p className="text-center">Không có dữ liệu hóa đơn.</p>
                    )}
                </Modal>
            </div>
        </ConfigProvider>
    );
};

export default OrderPage;
