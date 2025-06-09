import { Outlet, createBrowserRouter, Navigate } from "react-router-dom";
import Authentication from "./Authentication";
import RootLayoput from "./RootLayout";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import SalesPage from "../Pages/SalesPage/SalesPage";
import Login from "../Pages/LoginPage/Login";
import CustomerSearchPage from "../Pages/CustomerSearchPage/CustomerSearchPage";
import PaymentPage from "../Pages/SalesPage/PaymentPage";
import PrintReceiptPage from "../Pages/SalesPage/PrintReceiptPage";
import AddCustomerPage from "../Pages/AddCustomer/AddCustomerPage";
import Product from "../Pages/ProductPage/Product";
import ExchangeRatePage from "../Pages/ExchangeRatePage/ExchangeRatePage";
import DashBoardPage from "../Pages/DashBoardPage/DashBoardPage";
import ProducDetail from "../Pages/ProductPage/ProductDetail";
import BuyBackSuccessPaymentPage from "../Pages/BuyBackPage/BuyBackSuccessPaymentPage";
import BuyBackPage from "../Pages/BuyBackPage/BuyBackPage";
import BuyBackPaymentPage from "../Pages/BuyBackPage/BuyBackPaymentPage";
import UserManagePage from "../Pages/UserManagePage/UserManagePage";
import AddUserPage from "../Pages/AddUserPage/AddUserPage";
import CustomerSearchDetail from "../Pages/CustomerSearchPage/CustomerSearchDetail";
import Promotion from "../Pages/Promotion/Promotion";
import RoleBasedRoute from "../Components/Common/RoleBasedRoute";
import NoAccess from "../Pages/Authen/NoAccess";
import StaffStationPage from "../Pages/StaffStationPage/StaffStationPage";
import ChatRoom from "../Pages/RoomChatPage/ChatRoom";
import OrderPage from "../Pages/OrderPage/OrderPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Authentication>
        <RootLayoput>
          <Outlet />
        </RootLayoput>
      </Authentication>
    ),
    errorElement: (
      <RootLayoput>
        <ErrorPage />
      </RootLayoput>
    ),
    children: [
      {
        path: "sales-page",
        element: <SalesPage />,
      },
      {
        path: "promotion",
        element: (
          <RoleBasedRoute roles={["manager", "admin"]}>
            <Promotion />
          </RoleBasedRoute>
        ),
      },
      {
        path: "sales-page/Payment",
        element: <PaymentPage />,
      },
      {
        path: "sales-page/Payment/PrintReceiptPage",
        element: <PrintReceiptPage />,
      },
      {
        path: "buy-back-page",
        element: <BuyBackPage />,
      },
      {
        path: "buy-back-page/Payment",
        element: <BuyBackPaymentPage />,
      },
      {
        path: "buy-back-page/Payment/PrintReceiptPage",
        element: <BuyBackSuccessPaymentPage />,
      },
      {
        path: "exchange-rate",
        element: <ExchangeRatePage />,
      },
      {
        path: "station",
        element:
          <RoleBasedRoute roles={["manager", "admin"]}>
            <StaffStationPage />,
          </RoleBasedRoute>
      },
      {
        path: "no-access",
        element: <NoAccess />,
      },
      {
        path: "orders",
        element: <OrderPage />,
      },
      {
        path: "user",
        element: (
          <RoleBasedRoute roles={["admin"]}>
            <UserManagePage />
          </RoleBasedRoute>
        ),
      },
      {
        path: "user/user-add",
        element: (
          <RoleBasedRoute roles={["admin"]}>
            <AddUserPage />
          </RoleBasedRoute>
        ),
      },
      {
        path: "customer-search",
        element: (
          <CustomerSearchPage />
        ),
      },
      {
        path: "customer-search/customer-add",
        element: (
          <AddCustomerPage />
        ),
      },
      {
        path: "product",
        element: (
          <Product />
        ),
      },
      {
        path: "product/productdetail/:itemId",
        element: (
          <ProducDetail />
        ),
      },
      {
        path: "customer/customerdetail/:id",
        element: (
          <CustomerSearchDetail />
        ),
      },
      {
        path: "dashboard",
        element: (
          <RoleBasedRoute roles={["manager", "admin"]}>
            <DashBoardPage />
          </RoleBasedRoute>
        ),
      },
      {
        path: "chat-room",
        element: (
          <ChatRoom />
        ),
      },
    ],
  },

  {
    path: "login",
    element: <Login />,
  },
]);

export default router;
