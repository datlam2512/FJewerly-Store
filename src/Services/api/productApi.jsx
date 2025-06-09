import axios from "../axios/config";
const getProductAll = () => {
  return axios.get(`/api/Item`, {});
};
const getAllBuyBack = () => {
  return axios.get(`/api/Item/GetAllBuyBack`, {});
};
const getItemImage = () => {
  return axios.get(`/api/ItemImage`, {});
};
const getProductById = (itemId) => {
  const response = axios.get(`/api/Item/${itemId}`);
  return response;
};
const removeItem = (itemId) => {
  return axios.delete(`/api/Item/${itemId}`);
};
const addItem = (productDetails) => {
  return axios.post(`/api/Item`, productDetails);
};
const UploadImageItem = (File, itemId) => {
  return axios.post(`/api/ItemImage/upload`, File, itemId);
};
const ItemimageDetail = (itemID, count) => {
  return axios.get(`/api/ItemImage/ItemImages/${itemID}?count=${count}`);
};
const edititem = async (itemId, productDetails) => {
  return axios.put(`/api/Item/update/${itemId}`, productDetails, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
const reduceitem = async (itemId, quantity) => {
  return axios.put(`/api/Item/updateQuantity/${itemId}?quantity=${quantity}`);
};
export { getProductAll, getAllBuyBack, getProductById, removeItem, addItem, edititem, reduceitem, getItemImage, UploadImageItem, ItemimageDetail };
