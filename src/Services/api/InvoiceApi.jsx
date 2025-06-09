import axios from "../axios/config";

const addinvoice = (
  staffId,
  returnPolicyId,
  itemId,
  customerId,
  companyName,
  buyerAddress,
  status,
  paymentType,
  quantity,
  subTotal
) => {
  return axios.post(`/api/Sales/Invoices`, {
    staffId,
    returnPolicyId,
    itemId,
    customerId,
    companyName,
    buyerAddress,
    status,
    paymentType,
    quantity,
    subTotal,
  });
};
const createInvoice = (
  staffId,
  customerId,
  invoiceNumber,
  companyName,
  buyerAddress,
  status,
  paymentType,
  quantity,
  subTotal,
  createdDate,
  isBuyBack,
  items
) => {
  return axios.post('/api/Sales/CreateInvoiceWithItems', {
    invoice: {
      staffId,
      customerId,
      invoiceNumber,
      companyName,
      buyerAddress,
      status,
      paymentType,
      quantity,
      subTotal,
      createdDate,
      isBuyBack
    },
    items: items.map(item => ({
      itemID: item.itemID,
      returnPolicyId :item.returnPolicyId,
      itemQuantity: item.itemQuantity,
      warrantyExpiryDate: item.warrantyExpiryDate,
      price:item.price,
      total:item.total,
    })),
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};


const getinvoiceAll = () => {
  return axios.get(`/api/Sales/Invoices`, {});
};

const GetMonthlyRevenue = () => {
  return axios.get(`/api/Sales/MonthlyRevenue`, {});
}
const GetInvoicewithId = (id) => {
  return axios.get(`/api/Sales/InvoiceItems/${id}`, {});
}
const GetinvoiceWithserailnumber = (invoiceNumber) => {
  return axios.get(`/api/Sales/Invoice/ByNumber/${invoiceNumber}`, {});
}
export { addinvoice,getinvoiceAll, GetMonthlyRevenue,createInvoice,GetinvoiceWithserailnumber ,GetInvoicewithId };
