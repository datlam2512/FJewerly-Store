import axios from "../axios/config"
const getCustomerAll = () => {
    return axios.get(`/api/Customer`, {
    });
  };
  const getCustomerById=(id)=>{
    const response= axios.get(`/api/Customer/${id}`)
  return response;
  }
 const getCustomerByPhone=(phoneNumber)=>{
  const response= axios.get(`/api/Customer/phone/${phoneNumber}`)
return response;
}
const rewardCustomer = (customerId,addPoints) => {
  return axios.post(`/api/RewardsProgram`, {customerId,addPoints});
};
const rewardDetailCustomer = (customerId) => {
  return axios.get(`/api/RewardsProgram/${customerId}`);
};
const getRewardAll = () => {
  return axios.get(`/api/RewardsProgram`, {
  });
};
  export{getCustomerAll,getCustomerById,getCustomerByPhone,rewardCustomer,getRewardAll,rewardDetailCustomer}