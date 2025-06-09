import axiosClient from "../axios/config";

const staffStationkApi = {
    getAllStation: () => {
        return axiosClient.get('/api/StaffStation')
            .then(response => {
                const responseData = response.data;
                if (responseData) {
                    return responseData;
                } else {
                    throw new Error(response.message);
                }
            })
            .catch(error => {
                console.error("There was an error fetching station information!", error);
                throw error;
            });
    },
    createStation: (stationInfo) => {
        return axiosClient.post('/api/StaffStation', stationInfo)
            .then(response => {
                if (response.data) {
                    return response.data;
                } else {
                    throw new Error(response.data.message);
                }
            })
            .catch(error => {
                console.error("There was an error creating the station!", error);
                throw error;
            });
    },
    deleteStation: async (stationId) => {
        try {
            const response = await axiosClient.delete(`/api/StaffStation/Shift/${stationId}`);
            if (response.data.success) {
                console.log(response.data.message); // Hoặc xử lý thành công khác nếu cần
                return response.data;
            } else {
                throw new Error(response.errors);
            }
        } catch (error) {
            console.error("There was an error deleting the station:", error);
            throw error;
        }
    },
    updateStation: (stationId, stationInfo) => {
        return axiosClient.put(`/api/StaffStation/Shift/${stationId}`, stationInfo)
            .then(response => {
                if (response.data.success) {
                    return response.data.data;
                } else {
                    throw new Error(response.data.errors.join(', '));
                }
            })
            .catch(error => {
                console.error("There was an error updating the station!", error);
                throw error;
            });
    }



};


export default staffStationkApi;
