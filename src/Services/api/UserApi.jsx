import axiosClient from "../axios/config";

const userkApi = {
  getUserListApi: () => {
    return axiosClient.get('/api/Employee/Staff')
      .then(response => {
        const responseData = response.data;
        if (responseData) {
          return responseData;
        } else {
          throw new Error(response.message);
        }
      })
      .catch(error => {
        console.error("There was an error fetching user information!", error);
        throw error;
      });
  },
  getUserInfor: (id) => {
    return axiosClient.get(`/api/Employee/Staff/${id}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error("There was an error fetching the user!", error);
        throw error;
      });
  },
  createUser: (userInfo) => {
    return axiosClient.post('/api/Employee/AddEmployee', userInfo)
      .then(response => {
        if (response.data) {
          return response.data;
        } else {
          throw new Error(response.data.message);
        }
      })
      .catch(error => {
        console.error("There was an error creating the user!", error);
        throw error;
      });
  },
  hashPassword: (password) => {
    return axiosClient.post(`/api/Employee/HashPassword?password=${password}`)
      .then(response => {
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message);
        }
      })
      .catch(error => {
        console.error("There was an error hashing the password!", error);
        throw error;
      });
  },
};


export default userkApi;
