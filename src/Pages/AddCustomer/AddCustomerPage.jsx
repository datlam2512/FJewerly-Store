import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {LeftOutlined} from '@ant-design/icons';
import { Button, Form, Input, Typography, Radio, message, Modal } from 'antd'
import "./AddCustomerPage.scss"
import CustomerApi from "../../Services/api/CustomerApi";
import { strings_vi } from '../../Services/languages/displaystrings';

const AddCustomerPage = () => {
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const strAddCustomer = strings_vi.AddCustomerPage;
    const onFinish = async (values) => {
      let newCustomer = {
        ...values,
        status: "active"
      }
      setLoading(true);
      try { 
        let emailExists = null;
        let phoneNumberExists = null;
    
        try {
            emailExists = await CustomerApi.getCustomerByEmail(values.email);
        } catch (error) {
          console.log(error);
        }
        
        try {
            phoneNumberExists = await CustomerApi.getCustomerByPhoneNumber(values.phoneNumber);
        } catch (error) {
            console.log(error);
        }
          let errorMessage = [];
          if(emailExists && emailExists.email) errorMessage.push(strAddCustomer.Email);
          if(phoneNumberExists && phoneNumberExists.phoneNumber) errorMessage.push(strAddCustomer.PhoneNumber);
          if(errorMessage.length !== 0) {
          Modal.error({
              style: { top: '50%', transform: 'translateY(-50%)' },
              title: strAddCustomer.Confirm_CreateCustomer_Fail,
              content: `${errorMessage.join(' và ')} đã được sử dụng, xin vui lòng thử lại`,
              okText: "OK"
          });
          setLoading(false);
          return;
          }

          await CustomerApi.addCustomer(newCustomer);
          message.success(strAddCustomer.SUCCESS_CreateCustomer);
          Modal.confirm({
            title: strAddCustomer.Confirm_CreateCustomer_OK,
            content: strAddCustomer.SUCCESS_CreateCustomer,
            okText: "OK",
            style: { top: '50%', transform: 'translateY(-50%)' },
            onOk() {
              navigate(-1); 
            }
          })} catch (error) {
            setLoading(false);
            message.error(strAddCustomer.ERR_AddCustomer);
            Modal.warning({
              title: strAddCustomer.Confirm_CreateCustomer_Fail,
              content: strAddCustomer.ERR_AddCustomer,
              style: { top: '50%', transform: 'translateY(-50%)' },
              okText: "OK"
            });
            console.log('Failed to add customer:', error);

          }
        };

  return (
    <div className='add-customer-page'>
      <Button className="go-back-btn" type="primary" onClick={() => navigate(-1)} >
        Quay Lại
        <LeftOutlined />
      </Button>

      <div className="add-customer-form-container">
      <Typography.Title className="add-customer-title" level={3}>Thêm Khách Hàng</Typography.Title>
      <Form form={form} 
            onFinish={onFinish} 
            layout="vertical"
            initialValues={{ status: "active" }} 
      >
        <Form.Item name="customerName" label={strAddCustomer.Customername} rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="address" label={strAddCustomer.Address} rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="gender" label={strAddCustomer.Gender} rules={[{ required: true }]}>
                <Radio.Group>
                  <Radio value="Nam">Nam</Radio>
                  <Radio value="Nữ">Nữ</Radio>
                </Radio.Group>
        </Form.Item>
        
        <Form.Item name="phoneNumber" label={strAddCustomer.PhoneNumber} rules={[
                { required: true, message: strAddCustomer.WARN_InputPhoneNumber },
                {
                  pattern: new RegExp(/^\d{9,11}$/),
                  message: strAddCustomer.WARN_FormatPhoneNumber,
                },
              ]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label={strAddCustomer.Email} rules={[
                  { required: true, message: strAddCustomer.WARN_InputEmail },
                  {
                    type: 'email',
                    message: strAddCustomer.WARN_FormatEmail,
                  },
                ]}>
          <Input />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm Khách Hàng
          </Button>
        </Form.Item>
      </Form>
      </div>
    </div>
  )
}

export default AddCustomerPage;