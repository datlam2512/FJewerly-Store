import axios from "../axios/config"
const getDiscountAll = () => {
    return axios.get(`/api/Discount`, {
    });
  };

  export{getDiscountAll}