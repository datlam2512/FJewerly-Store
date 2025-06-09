import axios from "../axios/config";
const requestPromotion = (id,code,discountPct,status,cusID,description) => {
  return axios.post(`/api/CustomerPromotion`, {id,code,discountPct,status,cusID,description});
};
const promotionAll = () => {
  return axios.get(`/api/CustomerPromotion`);
};
const approvePromotionCus = (id) => {
    return axios.put(`/api/CustomerPromotion/approve/${id}`);
};
const rejectPromotionCus = (id) => {
  return axios.put(`/api/CustomerPromotion/reject/${id}`);
};
const deletePromotion = (id) => {
    return axios.delete(`/api/CustomerPromotion/${id}`)
}  
export {requestPromotion,approvePromotionCus,promotionAll, deletePromotion, rejectPromotionCus};
