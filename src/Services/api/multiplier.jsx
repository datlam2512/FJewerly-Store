import axios from 'axios';

const apiEndpoint = 'https://664cb68fede9a2b5565150ad.mockapi.io/login/multiplier';

export const getMultipliers = async () => {
    try {
        const response = await axios.get(apiEndpoint);
        return response.data[0]; 
    } catch (error) {
        console.error('Error fetching multipliers:', error);
        throw error;
    }
};

export const updateMultipliers = async (id, buyMultiplier, sellMultiplier) => {
    try {
        const response = await axios.put(`${apiEndpoint}/${id}`, {
            buyMultiplier,
            sellMultiplier
        });
        return response.data;
    } catch (error) {
        console.error('Error updating multipliers:', error);
        throw error;
    }
};
