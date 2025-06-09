import axios from "../axios/config";

const baseURL = '/api/Customer';

const getAllCustomers = async (searchValue = '') => { 
    const response = await axios.get(`${baseURL}?search=${searchValue}`);
    if(typeof response.data === 'object' && response.data.hasOwnProperty('data')) {
      return response.data.data;
    }
    return [];
};

const getCustomerByEmail = async (email) => {
    const response = await axios.get(`${baseURL}/email/${email}`); 
    return response.data;
}

const getCustomerByPhoneNumber = async (phoneNumber) => {
    const response = await axios.get(`${baseURL}/phone/${phoneNumber}`); 
    // console.log('getCustomerByPhoneNumber response:', response);
    return response.data;
}

const getCustomerByID = async (id) => {
    const response = await axios.get(`${baseURL}/${id}`);
    return response.data;
}
const addCustomer = async (customerData) => {
    const response = await axios.post(baseURL, customerData);
    return response.data;
}

const updateCustomer = async (customerId, customerData) => {
    const response = await axios.put(`${baseURL}/${customerId}`, customerData);
    return response.data;
}

const getMonthlyCustomers = async () => {
    const response = await axios.get(`${baseURL}/MonthlyCustomer`);
    return response.data;
};

export default { 
    getAllCustomers, 
    addCustomer, 
    updateCustomer,
    getCustomerByEmail,
    getCustomerByPhoneNumber,
    getCustomerByID,
    getMonthlyCustomers
};