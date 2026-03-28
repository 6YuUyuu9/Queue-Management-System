import api from '../api/axiosConfig';

export const userService = {
    login: async (username, password) => {
        const response = await api.post('/user.php/login', { username, password });
        return response.data;
    },
    register: async (username, password) => {
        const response = await api.post('/user.php/register', { username, password });
        return response.data;
    },
    getUsers: async () => {
        const response = await api.get('/user.php/users');
        return response.data;
    }
};