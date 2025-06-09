import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCustomerDetail } from '../../Features/Customer/CustomerdetailSlice';
import { fetchAllInvoice } from '../../Features/Invoice/fullinvoiceSlice';
import { fetchInvoiceById } from '../../Features/Invoice/invoiceByIdSlice';
import { fetchRewardAll } from '../../Features/Customer/rewardallSlice';
import { Tabs, Table, Button, Modal } from 'antd';
import { fetchRewardDetail } from '../../Features/Customer/rewardDetailSlice';
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import moment from 'moment';
import 'moment/locale/vi';

function CustomerSearchDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { customerDataDetail: customer, isError, loading: customerLoading } = useSelector(state => state.customerDetail);
  const { rewardDetail: rewards, isrewardetailError, loading: isrewardLoading } = useSelector(state => state.rewards);
  const { allInvoice, loading: invoicesLoading } = useSelector(state => state.invoicefull);
  const { invoiceIdDetail, loading, error } = useSelector(state => state.invoiceById);
  const { rewardsallData, loading: rewardsLoading } = useSelector(state => state.rewardsAll);
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onChange = (key) => {
    console.log(key);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerDetail(id));
      dispatch(fetchRewardDetail(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchAllInvoice());
    dispatch(fetchRewardAll());
  }, [dispatch]);

  const customerInvoices = allInvoice ? allInvoice.filter(invoice => invoice.customerId === id) : [];
  const customerInvoicesBuyBack = allInvoice ? allInvoice.filter(invoice => invoice.customerId === id&&invoice.isBuyBack===true) : [];
  const totalInvoices = customerInvoices.length;
console.log("check buy back invoice", customerInvoicesBuyBack)
  const showModal = async (id) => {
    await dispatch(fetchInvoiceById(id));
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a onClick={() => showModal(text)}>{text}</a>,
    },
    {
      title: 'Mã hóa đơn',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: 'Tên công ty',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'buyerAddress',
      key: 'buyerAddress',
    },
    {
      title: 'Hình thức thanh toán',
      dataIndex: 'paymentType',
      key: 'paymentType',
    },
    {
      title: 'Loại đơn hàng',
      dataIndex: 'isBuyBack',
      key: 'isBuyBack',
      render: (isBuyBack) => (isBuyBack ? 'Mua lại' : 'Bán ra'),
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

  const columnsmodal = [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'itemId',
      key: 'itemId',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: ['item', 'itemName'],
      key: 'itemName',
    },
    {
      title: 'Loại phụ kiện',
      dataIndex: ['item', 'accessoryType'],
      key: 'accessoryType',
    },
    {
      title: 'Loại phụ kiện',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];
  const calculateRewardLevel = (points) => {
    if (points >= 1000) return 'Vũ Trụ';
    if (points >= 100) return 'Kim Cương';
    if (points >= 50) return 'Vàng';
    if (points >= 10) return 'Bạc';
    return 'Chưa xếp hạng';
  };

  const customerRewards = rewardsallData ? rewardsallData.filter(reward => reward.customerId === id) : [];
  const hasRewards = customerRewards.length > 0;

  const items = [
    {
      key: '1',
      label: 'Hóa đơn',
      children: (
        <Table
          columns={columns}
          dataSource={customerInvoices}
          loading={invoicesLoading}
          rowKey="id"
        />
      ),
    },
    {
      key: '2',
      label: 'Hóa đơn mua lại',
      children: (
        <Table
          columns={columns}
          dataSource={customerInvoicesBuyBack}
          loading={invoicesLoading}
          rowKey="id"
        />
      ),
    },
    {
      key: '3',
      label: 'Điểm',
      children: (
        <div>
          {rewardsLoading ? (
            <p>Đợi chút.....</p>
          ) : hasRewards ? (
            <div>
              <h2 className='text-2xl font-bold'>Điểm của khách hàng</h2>
              <p className='my-3 text-xl'> Điểm :{rewards?.pointsTotal}</p>
              <p className='my-3 text-xl'>Hạng của khách hàng là:{calculateRewardLevel(rewards?.pointsTotal)}</p>
            </div>
          ) : (
            <p>Bạn chưa có điểm. Hãy mua hàng để tích điểm!</p>
          )}
        </div>
      ),
    },
  ];

  const handleGoBack = () => {
    navigate(-1);
  }

  return (
    <div className='m-6 flex-col justify-center align-middle mx-8 text-black'>
      <Button
        className="hover:bg-gray-900 font-bold rounded ml-2 mb-2"
        icon={<ArrowLeftOutlined />}
        onClick={handleGoBack} />
      <h1 className='text-4xl uppercase font-bold text-black'>Trang thông tin khách hàng</h1>
      <div className='mt-8 flex'>
        <div className='bg-white text-black px-32 pt-2 rounded-lg shadow-md w-full ml-1 flex justify-center'>
          <div>
            {customerLoading ? (
              <p>Đợi chút.....</p>
            ) : customer ? (
              <>
                <div className='flex mr-3'>
                  <UserOutlined className='mr-6 text-7xl mt-3' />
                  <div className='flex-col'>
                    <div className='flex w-[500%] mt-5 mr-'>
                      <h1 className='mr-6 text-xl font-bold uppercase'>Tên:</h1>
                      <p className='text-lg'>{customer.customerName}</p>
                    </div>
                    <div className='flex w-[500%] mt-3'>
                      <h1 className='mr-6 text-xl font-bold uppercase'>Số điện thoại:</h1>
                      <p className='text-lg'>{customer.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p>Không tìm thấy thông tin khách hàng.</p>
            )}
          </div>
        </div>
        <div className='bg-white px-32 py-10 pt-2 rounded-lg shadow-md w-[500%] ml-7 flex justify-center'>
          <div className='flex-col w-full'>
            <h2 className='text-2xl font-bold uppercase'>Hóa đơn</h2>
            {invoicesLoading ? (
              <p>Đợi chút.....</p>
            ) : (
              <div className='flex w-[200%] mt-7'>
                <p className='mr-5 text-lg'>Tổng đơn hàng: </p>
                <p className='text-lg'>{totalInvoices}</p>
              </div>
            )}
          </div>
        </div>
        <div className='bg-white px-32 pt-2 rounded-lg shadow-md w-[500%] ml-7 flex justify-center'>
          <div className='flex-col'>
            <p className='text-2xl font-bold uppercase'>Địa chỉ</p>
            {customerLoading ? (
              <p>Đợi chút.....</p>
            ) : customer ? (
              <p className='mt-8 text-lg'>{customer.address}</p>
            ) : (
              <p>Không tìm thấy địa chỉ.</p>
            )}
          </div>
        </div>
      </div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      <Modal title="Chi tiết hóa đơn" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} className='w-[1500px] ml-[500px]'
        style={{ top: '40%', transform: 'translateY(-50%)', transform: 'translateX(50%)' }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : invoiceIdDetail && invoiceIdDetail.data ? (
          <Table
            columns={columnsmodal}
            dataSource={invoiceIdDetail.data}
            rowKey="itemId"
            pagination={false}
            className='w-full'
          />
        ) : (
          <p>Không có dữ liệu hóa đơn.</p>
        )}
      </Modal>
      {console.log(invoiceIdDetail)}
    </div>
  );
}

export default CustomerSearchDetail;
