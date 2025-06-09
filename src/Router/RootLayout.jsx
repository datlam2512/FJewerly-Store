import Layout from "antd/es/layout/layout";
import Sidebar from "../Components/Layout/Sidebar/Sidebar";
import Header from "../Components/Layout/Header/Header";


function RootLayoput({ children }) {
    return (
        <Layout>
            <Header />
            <Layout>
                <Sidebar />
                {children}
            </Layout>
            {/* <Footer /> */}
        </Layout>
    );
}

export default RootLayoput;