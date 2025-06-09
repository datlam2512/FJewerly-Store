import React, { useState, useEffect } from 'react';
import { Line, Column } from '@ant-design/charts';
import { Pie } from '@ant-design/plots';
import '../DashBoardPage/DashBoardPage.scss';
import { Card, Space, Table, DatePicker } from 'antd';
import { UserOutlined, ShoppingCartOutlined, ShoppingOutlined, DollarCircleOutlined, TeamOutlined } from '@ant-design/icons';
import CustomerApi from '../../Services/api/CustomerApi';
import { getinvoiceAll, GetMonthlyRevenue } from '../../Services/api/InvoiceApi'
import { getProductAll } from '../../Services/api/productApi'
import userkApi from "../../Services/api/UserApi";
import DashBoardCard from './DashboardCard';
import viVN from 'antd/es/date-picker/locale/vi_VN';
const { RangePicker } = DatePicker;

const DashBoardPage = () => {
  const [customerCount, setCustomerCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [managerCount, setManagerCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [filteredRevenue, setFilteredRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topStaff, setTopStaff] = useState([]);
  const [soldInvoiceCount, setSoldInvoiceCount] = useState(0);
  const [buyBackInvoiceCount, setBuyBackInvoiceCount] = useState(0);
  const [monthlyCustomers, setMonthlyCustomers] = useState([]);
  const [soldProductCount, setSoldProductCount] = useState(0);
  const [buyBackProductCount, setBuyBackProductCount] = useState(0);
  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        const customers = await CustomerApi.getAllCustomers();
        if (Array.isArray(customers)) {
          const ActiveCustomer = customers.filter(cus => cus.status === 'active').length;
          setCustomerCount(ActiveCustomer);
          const invoices = await getinvoiceAll();
          if (invoices && Array.isArray(invoices.data)) {
            const customersWithOrders = customers.map(customer => ({
              ...customer,
              orderCount: invoices.data.filter(invoice => invoice.customerId === customer.id).length
            }));
            const topCustomers = customersWithOrders.sort((a, b) => b.orderCount - a.orderCount).slice(0, 3);
            setTopCustomers(topCustomers);
          }
        }
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    }


    const fetchUserCount = async () => {
      try {
        const response = await userkApi.getUserListApi();
        if (Array.isArray(response)) {
          const totalUsers = response.length;
          const managers = response.filter(user => user.roleId === 1).length;
          const staff = response.filter(user => user.roleId === 2).length;
          setUserCount(totalUsers);
          setManagerCount(managers);
          setStaffCount(staff);
          const invoices = await getinvoiceAll();
          if (invoices && Array.isArray(invoices.data)) {
            const staffWithInvoices = response.map(staff => ({
              ...staff,
              invoiceCount: invoices.data.filter(invoice => invoice.staffId === staff.staffId).length
            }));
            const topStaff = staffWithInvoices.sort((a, b) => b.invoiceCount - a.invoiceCount).slice(0, 3);
            setTopStaff(topStaff);
          }
        }
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    }

    const fetchInvoiceCount = async () => {
      try {
        const response = await getinvoiceAll();
        if (response && Array.isArray(response.data)) {
          const soldInvoices = response.data.filter(invoice => invoice.isBuyBack === false);
          const buyBackInvoices = response.data.filter(invoice => invoice.isBuyBack === true);
          // setInvoiceCount(response.data.length); 
          setSoldInvoiceCount(soldInvoices.length);
          setBuyBackInvoiceCount(buyBackInvoices.length);
        }
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    }

    const fetchProductCount = async () => {
      try {
        const response = await getProductAll();
        if (response && Array.isArray(response.data)) {
          const soldProducts = response.data.filter(product => product.isBuyBack === false);
          const buyBackProducts = response.data.filter(product => product.isBuyBack === true);
          // setProductCount(response.data.length);
          setSoldProductCount(soldProducts.length);
          setBuyBackProductCount(buyBackProducts.length);
        }
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    }

    const fetchMonthlyRevenue = async () => {
      try {
        const response = await GetMonthlyRevenue();
        // console.log(response);
        if (response) {
          const formattedData = response.data.map(item => ({
            date: item.key,
            value: item.value
          }));
          setMonthlyRevenue(formattedData);
          setFilteredRevenue(formattedData);


          const total = formattedData.reduce((sum, record) => sum + record.value, 0);
          setTotalRevenue(total);
        }
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    };

    const fetchMonthlyCustomers = async () => {
      try {
        const response = await CustomerApi.getMonthlyCustomers();
        if (Array.isArray(response)) {
          const formattedData = response.map(item => ({
            month: item.key,
            value: item.value
          }));
          setMonthlyCustomers(formattedData);
          }
        } catch (error) {
        console.error(`Error: ${error}`);
      }
    };

    fetchCustomerCount();
    fetchInvoiceCount();
    fetchProductCount();
    fetchUserCount();
    fetchMonthlyRevenue();
    fetchMonthlyCustomers();
  }, []);

  const columnConfig = {
    data: monthlyCustomers,
    xField: 'month',
    yField: 'value',
    label: {
      position: 'top',
      style: {
        fill: '#000000', 
        fontSize: 14, 
        fontWeight: 'bold', 
        opacity: 1,
      },
    },
    tooltip: false,
  };

  const formatRevenue = (value) => {
    return new Intl.NumberFormat().format(value) + ' VNĐ';
  };

  const pieData = [
    { type: 'Nhân Viên', value: staffCount },
    { type: 'Quản Lý', value: managerCount },
  ];

  const pieConfig = {
    appendPadding: 15,
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      formatter: (text, item) => {
        const percent = ((item.value / pieData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(2);
        return `${percent}%`;
      },
      style: {
        textAlign: 'center',
        fontSize: 16,
      },
    },
    legend: {
      color: {
        title: false,
        position: 'top',
        rowPadding: 5,
      },
    },
    tooltip: false,
  };

  const config = {
    tooltip: false,
    data: filteredRevenue,
    xField: 'date',
    yField: 'value',
    width: 900,
    height: 400,
    point: {
      size: 8,
      shape: 'diamond',
    },
    line: {
      style: {
        lineWidth: 3,
        stroke: '#FF4500',
      },
      label: {
        style: {
          fill: '#000000',
          fontSize: 12,
          fontWeight: 'bold',
        },
        formatter: (text) =>
          new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
      },
    },
  };

  const customerColumns = [
    {
      title: "STT",
      dataIndex: "customerId",
      key: "customerId",
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Tổng đơn hàng',
      dataIndex: 'orderCount',
      key: 'orderCount',
    },
  ];

  const staffColumns = [
    {
      title: "STT",
      dataIndex: "staffId",
      key: "staffId",
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Tổng đơn hàng',
      dataIndex: 'invoiceCount',
      key: 'invoiceCount',
    },
  ];

  const handleDateRangeChange = (dates, dateStrings) => {
    if (dates && dates.length === 2) {
      const [start, end] = dateStrings;
      const filtered = monthlyRevenue.filter((item) => {
        const date = item.date;
        return date >= start && date <= end;
      });
      setFilteredRevenue(filtered);
    } else {
      setFilteredRevenue(monthlyRevenue);
    }
  };

  return (
    <div className='w-full flex justify-center'>
      <div className='dashboard-content'>
        <div className="overview">
          <Space direction='horizontal'>
            <DashBoardCard icon={<UserOutlined style={{ color: "red" }} />} title={"Khách Hàng"} value={customerCount} key="customers" />
            <DashBoardCard icon={<TeamOutlined style={{ color: "purple" }} />} title={"Nhân Viên"} value={userCount} key="staff" />
            <DashBoardCard icon={<ShoppingCartOutlined style={{ color: "blue" }} />} title={"Đơn Hàng Đã Bán"} value={soldInvoiceCount} key="soldOrders" />
            <DashBoardCard icon={<ShoppingCartOutlined style={{ color: "orange" }} />} title={"Đơn Hàng Đã Mua"} value={buyBackInvoiceCount} key="boughtOrders" />            
            <DashBoardCard icon={<ShoppingOutlined style={{ color: "brown" }} />} title={"Mặt Hàng Bán"} value={soldProductCount} key="soldProducts" />
            <DashBoardCard icon={<ShoppingOutlined style={{ color: "black" }} />} title={"Mặt Hàng Đã Mua"} value={buyBackProductCount} key="boughtProducts" />
            <DashBoardCard icon={<DollarCircleOutlined style={{ color: "green" }} />} title={"Tổng Doanh Thu"} value={formatRevenue(totalRevenue)} key="revenue" />
          </Space>
        </div>
        <div className='main-content'>
          <div className='left-content'>
            <div className="line-chart-container">
              <Card title="Doanh số bán hàng theo tháng" style={{ width: '100%' }}>
                <RangePicker 
                    onChange={handleDateRangeChange} 
                    picker="month" 
                    format="YYYY-MM"
                    locale={viVN}
                    style={{ marginBottom: 20 }} />
                <Line {...config} width={600} height={300}/>
              </Card>
            </div>
            <div className='w-full flex justify-between mt-5'>
              <div className="top-staff">
                <Card title="Top 3 nhân viên bán được nhiều nhất:" className="card-top-staff h-[420px]">
                  <Table columns={staffColumns} dataSource={topStaff} rowKey="id" pagination={false} key="staffTable" className='w-full'/>
                </Card>
              </div>
              <div className="top-customers">
                <Card title="Top 3 khách hàng có nhiều đơn nhất:" className="card-top-customers h-[420px]">
                  <Table columns={customerColumns} dataSource={topCustomers} rowKey="id" pagination={false} key="customerTable" />
                </Card>
              </div>
            </div>

          </div>
          <div className='right-content'>
            <div className="column-chart-container">
              <Card title="Khách hàng mới mỗi tháng" style={{ width: '100%' }}>
                <Column {...columnConfig} width={600} height={350} className="w-full" />
              </Card>
            </div>
            <div className="pie-chart-container h-[585px]">
              <Card title="Tỉ lệ người dùng hệ thống" className="card-pie-chart w-[400px] h-[420px] mt-10">
                <Pie {...pieConfig} width={350} height={350}/>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default DashBoardPage