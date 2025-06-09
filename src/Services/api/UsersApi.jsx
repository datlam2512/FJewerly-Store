import axios from "../axios/config";

const removeuser = (staffId) => {
    return axios.delete(`/api/Employee/Staff/${staffId}`);
  };
  const edituser = async (staffId, userdetail) => {
    return axios.put(`/api/Employee/Staff/${staffId}`, userdetail, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
}
export {removeuser,edituser};