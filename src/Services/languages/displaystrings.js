const strings_vi = {
    SideBar: {
        Overview: "Tổng quan",
        Payment: "Thanh toán",
        Buy: "Mua lại",
        Sell: "Bán hàng",
        Products: "Sản Phẩm",
        SearchProfile: "Tìm kiếm khách hàng",
        Setting: "Cài đặt",
        GoldPrice: "Giá vàng",
        // Test:"payment ammout: {}".format("23")
    },
    AddCustomerPage: {
        Customername: 'Tên Khách Hàng',
        Address: 'Địa Chỉ',
        Gender: 'Giới Tính',
        PhoneNumber: 'Số Điện Thoại',
        Email: 'Email',
        SUCCESS_CreateCustomer: 'Thêm khách hàng thành công',
        Confirm_CreateCustomer_OK: 'Thành Công',
        Confirm_CreateCustomer_Fail: 'Không thành công',
        ERR_AddCustomer: 'Thêm khách hàng không thành công, xin vui lòng thử lại',
        ERR_EmailandPhoneExisted: 'đã được sử dụng, vui lòng thử lại',
        WARN_InputPhoneNumber: 'Vui lòng nhập số điện thoại',
        WARN_FormatPhoneNumber: 'Số điện thoại từ 9-11 ký tự!',
        WARN_FormatEmail: 'Vui lòng nhập đúng định dạng Email!',
        WARN_InputEmail: "Vui lòng nhập Email!",
    },
    CustomerSearchPage : {
        Customername: 'Tên Khách Hàng',
        Address: 'Địa Chỉ',
        Gender: 'Giới Tính',
        PhoneNumber: 'Số Điện Thoại',
        Email: 'Email',
        Points: 'Điểm',
        Actions: 'Thao tác',
        TIT_UpdateCutsomer: 'Cập nhật thông tin khách hàng',
        SearchBarPlaceHolder: 'Tìm kiếm theo tên và số điện thoại',
        DeleteSuccess: "Khách Hàng {} đã được xóa thành công",
        ERR_Registed_Phone: 'Số điện thoại này đã được đăng ký!',
        ERR_Registed_Email: 'Email này đã được đăng ký!',
        ERR_Delete_Customer: 'Xóa khách thông tin hàng không thành công',
        ERR_Update_Customer: 'Cập nhật khách hàng không thành công',
        NOTI_Delete_Customer: 'Bạn muốn xóa khách hàng này?',
        WARN_InputName: 'Vui lòng nhập tên',
        WARN_InputAddress: 'Vui lòng nhập địa chỉ',
        WARN_InputGender: 'Vui lòng chọn giới tính',
        WARN_InputPhoneNumber: 'Vui lòng nhập số điện thoại',
        WARN_FormatPhoneNumber: 'Số điện thoại từ 9-11 ký tự!',
        WARN_FormatEmail: 'Vui lòng nhập đúng định dạng Email!',
        SUCCESS_Update_Customer: 'Cập nhật thông tin khách hàng thành công',
    }


}

String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    })
}

module.exports = {strings_vi, format: String.prototype.format}