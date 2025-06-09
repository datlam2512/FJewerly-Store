import axios from "../axios/config";

const addwwarranty = (
    customerId
) => {
  return axios.post(`/api/Sales/Warranties`, {
    customerId
  });
};
const getwarrantyall = () => {
  return axios.get(`/api/Sales/Warranty`, {});
};
export { addwwarranty,getwarrantyall };
