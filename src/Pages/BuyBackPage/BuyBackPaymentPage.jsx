import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Table, Select, Space, ConfigProvider, Spin, Form, message, Modal } from "antd";
import { fetchCustomerData } from "../../Features/buy-back/buyBackCustomerSlice";
import { resetCart, updateCustomerInfo, updateInvoiceNumber } from "../../Features/buy-back/buyBackCartSlice";
import buyBackApi from "../../Services/api/buyBackApi";
import { EditOutlined, FormOutlined } from "@ant-design/icons";
import '../BuyBackPage/BuyBackPaymentPage.scss'
const BuyBackPaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.buyBackCart.cartItems);
  const customerData = useSelector(state => state.buyBackCustomer.customerData);
  const isLoading = useSelector(state => state.buyBackCustomer.isLoading);
  const buyGold24k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold24k);
  const buyGold18k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold18k);
  const buyGold14k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold14k);
  const buyGold10k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold10k);
  const cartTotalAmount = useSelector((state) => state.buyBackCart.cartTotalAmount);
  const cartTotalQuantity = useSelector((state) => state.buyBackCart.cartTotalQuantity);
  const customerInfor = useSelector((state) => state.buyBackCart.customerInfor);

  const customerIdFromSlice = useSelector((state) => state.buyBackCart.customerId);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerGender, setCustomerGender] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  // const [staffId, setStaffId] = useState("");

  // const currentDateTime = new Date();
  // const formattedDateTime = currentDateTime.toISOString().replace(/[^0-9]/g, "").slice(0, 14);
  // const invoiceNumber = "BBI" + formattedDateTime;

  useEffect(() => {
    dispatch(fetchCustomerData());
    // setStaffId(localStorage.getItem('nameid'))
  }, [dispatch]);

  useEffect(() => {
    const foundCustomer = customerData.find(customer => customer.id === customerIdFromSlice);
    if (foundCustomer) {
      dispatch(updateCustomerInfo(foundCustomer));
    }
  }, [customerData, customerIdFromSlice, dispatch]);

  useEffect(() => {
    if (customerInfor) {
      setCustomerName(customerInfor.customerName);
      setCustomerPhoneNumber(customerInfor.phoneNumber);
      setCustomerAddress(customerInfor.address);
      setCustomerGender(customerInfor.gender);
      setCustomerEmail(customerInfor.email);
    }
  }, [customerInfor, isModalVisible]);

  const handleConfirm = () => {
    if (!customerInfor) {
      message.error("Vui lòng nhập đầy đủ thông tin khách hàng trước khi xác nhận.");
    } else {
      const currentDateTime = new Date();
      const formattedDateTime = currentDateTime.toISOString().replace(/[^0-9]/g, "").slice(0, 14);
      const invoiceNumber = "BBI" + formattedDateTime;
      const staffId = localStorage.getItem('nameid');

      dispatch(updateInvoiceNumber(invoiceNumber));

      const invoiceInfor = {
        invoice: {
          staffId: staffId,
          customerId: customerInfor.id,
          invoiceNumber: invoiceNumber,
          companyName: "PNJ",
          buyerAddress: customerInfor.address,
          status: "Active",
          paymentType: "Tiền mặt",
          quantity: cartTotalQuantity,
          subTotal: cartTotalAmount,
          createdDate: currentDateTime.toISOString(),
          isBuyBack: true
        },
        items: cartItems.map(item => ({
          itemID: item.itemId,
          itemQuantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })
        )
      };
      console.log("invoiceInfor: ", invoiceInfor)
      buyBackApi.createBuyBackInvoice(invoiceInfor)
        .then(response => {
          message.success("Hóa đơn đã được tạo thành công.");
          navigate("/buy-back-page/Payment/PrintReceiptPage");
        })
        .catch(error => {
          message.error("Có lỗi xảy ra khi tạo hóa đơn.");
        });
    }
  };

  const handleModalOk = () => {
    const updatedCustomerInfo = {
      customerName,
      phoneNumber: customerPhoneNumber,
      address: customerAddress,
      gender: customerGender,
      email: customerEmail,
      status: "active"
    };

    buyBackApi.updateCustomer(customerInfor.id, updatedCustomerInfo)
      .then(response => {
        message.success("Thông tin khách hàng đã được cập nhật thành công.");
        dispatch(updateCustomerInfo(updatedCustomerInfo));
        setIsModalVisible(false);
      })
      .catch(error => {
        message.error("Có lỗi xảy ra khi cập nhật thông tin khách hàng.");
      });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleEditCustomerInfo = () => {
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "numericalOrder",
      key: "numericalOrder",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã Hàng",
      dataIndex: "itemId",
      key: "itemId",
      width: 120,
    },
    {
      title: "Tên Hàng",
      dataIndex: "itemName",
      key: "itemName",
      width: 150,
    },
    {
      title: "Loại Hàng",
      dataIndex: "accessoryType",
      key: "accessoryType",
      width: 100,
    },
    {
      title: "Loại Vàng",
      dataIndex: "goldType",
      key: "goldType",
      width: 100,
      render: (_, record) => {
        let goldType = "";
        if (record.itemName.toLowerCase().includes("10k")) {
          goldType = "10K";
        } else if (record.itemName.toLowerCase().includes("14k")) {
          goldType = "14K";
        } else if (record.itemName.toLowerCase().includes("18k")) {
          goldType = "18K";
        } else if (record.itemName.toLowerCase().includes("24k")) {
          goldType = "24K";
        }
        return goldType;
      },
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (_, record) => (
        <div className="flex items-center">
          <span className="mx-2">{record.quantity}</span>
        </div>
      ),
    },
    {
      title: "Trọng Lượng",
      dataIndex: "weight",
      key: "weight",
      width: 100,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (_, record) => {
        let goldType = "";
        if (record.itemName.toLowerCase().includes("10k")) {
          goldType = "10K";
        } else if (record.itemName.toLowerCase().includes("14k")) {
          goldType = "14K";
        } else if (record.itemName.toLowerCase().includes("18k")) {
          goldType = "18K";
        } else if (record.itemName.toLowerCase().includes("24k")) {
          goldType = "24K";
        }

        let kara;
        switch (goldType) {
          case "10K":
            kara = buyGold10k;
            break;
          case "14K":
            kara = buyGold14k;
            break;
          case "18K":
            kara = buyGold18k;
            break;
          case "24K":
            kara = buyGold24k;
            break;
          default:
            kara = 0;
        }

        const totalPrice = record.weight * record.quantity * kara;
        return `${Number(totalPrice.toFixed(0)).toLocaleString()}đ`;
      },
    },
  ];

  return (
    <div className="buyback-payment-page">
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
      <div className="payment-page w-full p-4">
        <div className="order-summary bg-gray-50 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-bold mb-4 text-black">Đơn hàng</h2>
          <div className="cart-items w-full">
            <Table
              dataSource={cartItems}
              columns={columns}
              rowKey="itemId"
              pagination={false}
              scroll={{ y: 378 }}
              className="w-full rounded-[5px] font-medium"
            />
          </div>
        </div>
        <div className="customer-info bg-white p-4 rounded-lg mb-4">
          <div className="items-center mb-[15px] pb-[15px] pt-[10px] border-b-[1px]">
            <div className="w-[15%] mr-4 mb-6 flex justify-between items-center">
              <h3 className="text-[20px] font-bold w-full text-black">Thông tin khách hàng</h3>
              <FormOutlined className="text-[16px] text-gray-900 hover:text-gray-600 cursor-zoom-in" onClick={handleEditCustomerInfo} />
            </div>
            <div className="customer-details text-black">
              <div className="w-2/5 flex justify-between text-[16px] mb-2">
                <p className="mr-4 font-semibold">Tên khách hàng:</p><span className="italic">{customerInfor.customerName}</span>
              </div>
              <div className="w-2/5 flex justify-between text-[16px] mb-2">
                <p className="mr-4 font-semibold">Số điện thoại:</p><span className="italic">{customerInfor.phoneNumber}</span>
              </div>
              <div className="w-2/5 flex justify-between text-[16px] mb-2">
                <p className="mr-4 font-semibold">Địa Chỉ:</p><span className="italic">{customerInfor.address}</span>
              </div>
              <div className="w-2/5 flex justify-between text-[16px] mb-2">
                <p className="mr-4 font-semibold">Giới Tính:</p><span className="italic">{customerInfor.gender}</span>
              </div>
              <div className="w-2/5 flex justify-between text-[16px] mb-2">
                <p className="mr-4 font-semibold">E-mail:</p><span className="italic">{customerInfor.email}</span>
              </div>
            </div>

          </div>
        </div>
        <div className="flex w-full">
          <div className="cart-summary mt-4 bg-white p-6 rounded-lg shadow-md w-1/2 mr-3">
            <div className="cart-checkout mt-6">
              <div className="flex-row">
                <div className="flex justify-between mb-3 text-lg text-black">
                  <p>Tổng số lượng sản phẩm:</p>
                  <p>{cartTotalQuantity}</p>
                </div>
                <div className="flex justify-between mb-3 text-lg text-black">
                  <p>Tạm tính</p>
                  <p>{Number(cartTotalAmount.toFixed(0)).toLocaleString()}đ</p>
                </div>
              </div>
              <div className="mt-14 flex justify-between">
                <span className="text-lg font-semibold text-gray-800">
                  Tổng tiền trả khách
                </span>
                <span className="amount text-xl font-bold text-gray-800">
                  {Number(cartTotalAmount.toFixed(0)).toLocaleString()}đ
                </span>
              </div>
            </div>
          </div>
          <div className="cart-summary mt-4 bg-white p-6 rounded-lg shadow-md w-1/2">
            <div>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "rgb(101, 163, 13)",
                    colorPrimaryHover: "rgb(101, 163, 13)"
                  },
                }}
              >
              </ConfigProvider>
            </div>
            <div>
              <Button className="confirm-btn w-full h-14 bg-black text-white uppercase font-bold hover:bg-gray-500" onClick={handleConfirm}>
                Xác Nhận
              </Button>
              <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
              <Link to="/buy-back-page">
                <Button className="w-full h-14 bg-white text-black uppercase font-bold hover:bg-gray-500 mt-4">
                  Hủy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Chỉnh sửa thông tin khách hàng"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item label="Tên khách hàng">
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </Form.Item>
          <Form.Item label="SĐT">
            <Input value={customerPhoneNumber} onChange={(e) => setCustomerPhoneNumber(e.target.value)} />
          </Form.Item>
          <Form.Item label="Địa chỉ">
            <Input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
          </Form.Item>
          <Form.Item label="Giới tính">
            <Select value={customerGender} onChange={(value) => setCustomerGender(value)}>
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nữ">Nữ</Select.Option>
              <Select.Option value="Khác">Khác</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Email">
            <Input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
      {/* {console.log("customerInfor: ", customerInfor)} */}
    </ConfigProvider>
    </div>
  );
};

export default BuyBackPaymentPage;
