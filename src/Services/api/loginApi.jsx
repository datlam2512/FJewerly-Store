import axiosClient from "../axios/config";

export const loginUser = async (email, password) => {
    try {
        const response = await axiosClient.post("/api/Employee/Login", {
            usernameOrEmail: email,
            password: password,
        });
        const responseData = response.data;

        if (responseData.success) {
            const token = responseData.data;
            localStorage.setItem("token", token );

            return { token };
        } else {
            throw new Error(responseData.message);
        }
    } catch (error) {
        throw error;
    }
};