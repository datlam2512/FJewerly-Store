import {  Result } from "antd";
const NoAccess = () => {
    return (
        <div className="flex justify-center align-middle w-full">
        <Result
          status="403"
          title="403"
          subTitle={"Xin lỗi, bạn không có quyền truy cập vào trang này"}
        />
        </div>
      );
};

export default NoAccess;
