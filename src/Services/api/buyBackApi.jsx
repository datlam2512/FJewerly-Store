import axiosClient from "../axios/config";

const buyBackApi = {
  getItem: (id) => {
    return axiosClient.get(`/api/Item/${id}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error("There was an error fetching the item!", error);
        throw error;
      });
  },
  getCustomerbyId: (id) => {
    return axiosClient.get(`/api/Customer/${id}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error("There was an error fetching the customer!", error);
        throw error;
      });
  },
  getCustomerInforApi: () => {
    return axiosClient.get('/api/Customer')
      .then(response => {
        const responseData = response.data;
        if (responseData.success) {
          const customerData = responseData.data;
          return customerData;
        } else {
          throw new Error(responseData.message);
        }
      })
      .catch(error => {
        console.error("There was an error fetching customer information!", error);
        throw error;
      });
  },

  getinvoiceAll: () => {
    return axiosClient.get('/api/Sales/Invoices')
      .then(response => {
        const responseData = response.data;
        if (responseData) {
          const orderData = responseData.data;
          return orderData;
        } else {
          throw new Error(responseData.message);
        }
      })
      .catch(error => {
        console.error("There was an error fetching order information!", error);
        throw error;
      });
  },

  createCustomer: (customerInfo) => {
    return axiosClient.post('/api/Customer', customerInfo)
      .then(response => {
        if (response.data) {
          return response.data;
        } else {
          throw new Error(response.data.message);
        }
      })
      .catch(error => {
        console.error("There was an error creating the customer!", error);
        throw error;
      });
  },
  updateCustomer: (id, customerInfo) => {
    return axiosClient.put(`/api/Customer/${id}`, customerInfo)
      .then(response => {
        if (response.data) {
          return response.data;
        } else {
          throw new Error(response.statusText);
        }
      })
      .catch(error => {
        console.error("There was an error updating the customer!", error);
        throw error;
      });
  },
  getInvoice: (id) => {
    return axiosClient.get(`/api/Sales/InvoiceItems/${id}`)
      .then(response => {
        if (response.data.success) {
          const invoiceItems = response.data.data;
          return invoiceItems.map(item => ({
            itemId: item.itemId,
            accessoryType: item.item.accessoryType,
            itemName: item.item.itemName,
            quantity: item.quantity,
            weight: item.item.weight,
            buyPrice: item.total,
          }));
        } else {
          throw new Error(response.data.message);
        }
      })
      .catch(error => {
        console.error("There was an error fetching the invoice!", error);
        throw error;
      });
  },

  getInvoiceNumber: (invoiceNumber) => {
    return axiosClient.get(`/api/Sales/Invoice/ByNumber/${invoiceNumber}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error("There was an error fetching the InvoiceNumber!", error);
        throw error;
      });
  },
  createBuyBackInvoice: (invoiceInfor) => {
    return axiosClient.post('/api/Sales/CreateBuyBackInvoiceWithItems', invoiceInfor)
      .then(response => {
        if (response.data) {
          return response.data;
        } else {
          throw new Error(response.data.message);
        }
      })
      .catch(error => {
        console.error("There was an error creating the invoice!", error);
        throw error;
      });
  },
};

export default buyBackApi;
