import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Input, Table, Space, Button, Modal, message, Form, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./CustomerSearchPage.scss"
import CustomerApi from "../../Services/api/CustomerApi";
import { Link } from "react-router-dom";
import { strings_vi } from "../../Services/languages/displaystrings";
const CustomerSearchPage = () => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState({});
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const strCustomerSearch = strings_vi.CustomerSearchPage;
    useEffect(() => {
        fetchCustomers();
    }, []); 
    
    const checkIfCustomerExists = (phone, email, id) => {
        let trimmedPhone = phone.trim();
        let trimmedEmail = email.trim();
        const phoneExists = allCustomers.find(customer => customer.phoneNumber === trimmedPhone && customer.id !== id);
        const emailExists = allCustomers.find(customer => customer.email === trimmedEmail && customer.id !== id);
        
        if(phoneExists){ 
          message.error(strCustomerSearch.ERR_Registed_Phone);
          return true;
        }
        if(emailExists){ 
          message.error(strCustomerSearch.ERR_Registed_Email);
          return true;
        } 
        return false;
      }

    const handleSearch = () => {
    if(searchValue === '')  {
        setCustomers(allCustomers);
    } else {
        const filteredCustomers = allCustomers.filter(customer => 
            customer.customerName.toLowerCase().includes(searchValue.toLowerCase()) || 
            customer.phoneNumber.includes(searchValue)
        );
        setCustomers(filteredCustomers);
    }
    };

    const fetchCustomers = async () => {
    setLoading(true);
    try {
        const data = await CustomerApi.getAllCustomers();
        // console.log('Data from API: ', data);    
        const activeCustomers = data.filter(customer => customer.status === 'active');
        setAllCustomers(activeCustomers); 
        setCustomers(activeCustomers); 
    } catch(error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
    };

    const handleAddCustomer = () => {
        navigate('/customer-search/customer-add');
    }

    const handleUpdate = (record) => {
            form.setFieldsValue({
            customerName: record.customerName,
            address: record.address,
            gender: record.gender,
            phoneNumber: record.phoneNumber,
            email: record.email
            }); 
            setCurrentCustomer(record);
            setIsModalVisible(true);
        };

    const handleDelete = (customerId) => {
        Modal.confirm({
            title: strCustomerSearch.NOTI_Delete_Customer,
            style: { top: '50%', transform: 'translateY(-50%)' },
            async onOk() {
                try {
                    const customer = await CustomerApi.getCustomerByID(customerId); 
                    customer.status = 'inactive'; 
                    const updatedCustomer = await CustomerApi.updateCustomer(customerId, customer); 
                    message.success(strings_vi.CustomerSearchPage.DeleteSuccess.format(updatedCustomer.customerName));
                    fetchCustomers(); 
                } catch (error) {
                    message.error(strCustomerSearch.ERR_Delete_Customer);
                    console.log(error.message)   
                }
            },
            onCancel() {
                
            },
        });
    }

    const columns = [
        {
            title: strCustomerSearch.Customername,
            dataIndex: 'customerName',
            render: (text, record) =>(
                <Link className="text-blue-500" to={`/customer/customerdetail/${record.id}`}>{text}</Link>
              )  
        },
        {
            title: strCustomerSearch.Address,
            dataIndex: 'address'
        },
        {
            title: strCustomerSearch.Gender,
            dataIndex: 'gender'
        },
        {
            title: strCustomerSearch.PhoneNumber,
            dataIndex: 'phoneNumber'
        },
        {
            title: strCustomerSearch.Email,
            dataIndex: 'email'
        },
        {
            title: strCustomerSearch.Actions,
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <EditOutlined className='text-yellow-500' onClick={() => handleUpdate(record)} />
                    <DeleteOutlined className='text-red-500' onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ];

    return (
        <div className="customer-search">
            <div className="search-section">
                <Input className="search-input" 
                    placeholder= {strCustomerSearch.SearchBarPlaceHolder}
                    value={searchValue}
                    onChange={async event => {setSearchValue(event.target.value);
                                                if(event.target.value === '') {
                                                await fetchCustomers('')
                                            }
                                            }}
                    onPressEnter={handleSearch}
                    allowClear
            />
                    <Button 
                        type="primary" 
                        className="search-button" 
                        onClick={handleSearch} 
                        loading={loading}>
                        Tìm kiếm
                    </Button>
                    <Button type="primary" 
                        className="add-customer-button"
                        onClick={handleAddCustomer}
                        >Thêm Khách Hàng
                    </Button>
            </div>
                <Table
                    columns={columns}
                    dataSource={customers}
                    loading={loading}
                    // pagination={{ pageSize: 15 }}
                    rowKey="id"           
                />
                    <Modal title = {strCustomerSearch.TIT_UpdateCutsomer}
                    open={isModalVisible} 
                    onCancel={() => {
                        setIsModalVisible(false) 
                    }}
                    footer={null}>

                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            customerName: currentCustomer.customerName,
                            address: currentCustomer.address,
                            gender: currentCustomer.gender,
                            phoneNumber: currentCustomer.phoneNumber,
                            email: currentCustomer.email
                        }}
                        onFinish={ async (values) => {
                            const trimmedEmail = values.email.trim();
                            const trimmedPhoneNumber = values.phoneNumber.trim();
                            if(checkIfCustomerExists(trimmedPhoneNumber, trimmedEmail, currentCustomer.id)){
                                return;
                            }
                            try {
                                const updatedValues = { ...values, phoneNumber: trimmedPhoneNumber, email: trimmedEmail, status: currentCustomer.status };
                                await CustomerApi.updateCustomer(currentCustomer.id, updatedValues);
                                message.success(strCustomerSearch.SUCCESS_Update_Customer);
                                fetchCustomers();
                                setIsModalVisible(false);
                                form.resetFields();
                            } catch (error) {
                                message.error(strCustomerSearch.ERR_Update_Customer);
                                return [];
                            }
                        }}
                    >
                        <Form.Item
                            label={strCustomerSearch.Customername}
                            name="customerName"
                            rules={[{ required: true, message: strCustomerSearch.WARN_InputName }]}
                        >
                <Input />
                        </Form.Item>

                        <Form.Item
                            label={strCustomerSearch.Address}
                            name="address"
                            rules={[{ required: true, message: strCustomerSearch.WARN_InputAddress }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={strCustomerSearch.Gender}
                            name="gender"
                            rules={[{ required: true, message: strCustomerSearch.WARN_InputGender }]}
                        >
                            <Select>
                                <Select.Option value="Nam">Nam</Select.Option>
                                <Select.Option value="Nữ">Nữ</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={strCustomerSearch.PhoneNumber}
                            name="phoneNumber"
                            rules={[{   required: true, message: strCustomerSearch.WARN_InputPhoneNumber },
                                    {
                                        pattern: new RegExp(/^\d{9,11}$/),
                                        message: strCustomerSearch.WARN_FormatPhoneNumber,
                                    },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label= {strCustomerSearch.Email}
                            name="email"
                            rules={[
                                {   
                                    type: 'email',
                                    required: true, 
                                    message: strCustomerSearch.WARN_FormatEmail, 
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" block htmlType="submit">
                                Cập Nhật
                            </Button>
                        </Form.Item>
                    </Form>
            </Modal>
        </div>  
    )
}

export default CustomerSearchPage;