import { Result } from 'antd';
import "./ErrorPage.scss"

function ErrorPage() {
    return (
        <div className="wrapper">
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, trang bạn vừa truy cập không tồn tại."
            />
        </div>
    );
}

export default ErrorPage;