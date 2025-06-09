import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { useSelector, useDispatch } from "react-redux";
import { Button, ConfigProvider } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { resetCart } from "../../Features/product/cartSlice";
import InvoiceComponent from "../../Components/Common/InvoiceComponent";
import WarrantyComponent from "../../Components/Common/WarrantyComponent";
import { useLocation } from "react-router-dom";
import Reproduct from "../../Components/Common/Reproduct";
import '../SalesPage/PrintReceiptPage.scss'
function PrintReceiptPage() {
  const dispatch = useDispatch();
  const handleReset = () => {
    setTimeout(() => {
      dispatch(resetCart());
    }, ); 
  };

  const cartItems = useSelector((state) => state.cart.cartItems);
  const customerInfor = useSelector((state) => state.cart.customerInfor);
  const cartTotalQuantity = useSelector((state) => state.cart.cartTotalQuantity);
  const cartTotalAmount = useSelector((state) => state.cart.cartTotalAmount);
  const discount = useSelector((state) => state.cart.discount);
  const discountspecial = useSelector((state) => state.cart.discountspecial);
  const invoiceComponentRef = useRef();
  const warrantyComponentRef = useRef();
  const ReproductRef = useRef();
  const location = useLocation();
  const invoiceNumber = location.state?.invoiceNumber || '';
  return (
    <div className="print-receipt-page flex justify-center align-middle w-full">
    <ConfigProvider 
      theme={{
        token: {
          colorPrimary: "var(--primary-color)",
          colorPrimaryHover: "var(--primary-color-hover)"
        },
      }}
    >
      <div className="flex-col text-center justify-center w-full">
        <div className="mt-60 ml-10">
          <CheckCircleOutlined className="text-9xl my-8 text-green-400" />
          <p className="font-bold text-lg text-black">Thanh toán thành công</p>
          <div className="flex-col mt-9">
            <ReactToPrint
              trigger={() => <Button className="print-receipt-btn w-80 h-14 bg-black text-white uppercase font-bold">In hóa đơn</Button>}
              content={() => invoiceComponentRef.current}
            />
            <ReactToPrint
              trigger={() => <Button className="print-warranty-btn w-80 h-14 bg-black text-white uppercase font-bold mt-4">In bảo hành</Button>}
              content={() => warrantyComponentRef.current}
            />
            <ReactToPrint
              trigger={() => <Button className="print-return-btn w-80 h-14 bg-black text-white uppercase font-bold mt-4">In đổi trả hàng</Button>}
              content={() => ReproductRef.current}
            />
            <Link to="/sales-page">
              <Button onClick={handleReset} className="w-80 h-14 bg-white text-black uppercase font-bold ml-4">
                Tạo đơn mới
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden">
      <InvoiceComponent
        ref={invoiceComponentRef}
        cartItems={cartItems}
        customerInfor={customerInfor}
        cartTotalQuantity={cartTotalQuantity}
        cartTotalAmount={cartTotalAmount}
        invoiceNumber={invoiceNumber} 
        discount={discount} 
        discountspecial={discountspecial} 
        />
        <WarrantyComponent
          ref={warrantyComponentRef}
          customerInfor={customerInfor}
          cartItems={cartItems}
        />
        <Reproduct
          ref={ReproductRef}
          customerInfor={customerInfor}
          cartItems={cartItems}
        />
      </div>
      {console.log("Check cart",cartItems)}
    </ConfigProvider>
    </div>
  );
}

export default PrintReceiptPage;
