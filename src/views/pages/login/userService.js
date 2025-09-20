import axios from 'axios';
import config from '/src/config'; // Adjust the path based on your file structure

const API_URL = `${config.apiUrl}users`;

export const loginUser = async (username, password, role) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password, role });
        return response.data;
    } catch (error) {
        throw error;
    }
};
