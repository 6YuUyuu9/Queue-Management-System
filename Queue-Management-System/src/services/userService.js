import api from '../api/axiosConfig';

export const userService = {
    login: async (username, password) => {
        const response = await api.post('/user.php/login', { username, password });
        return response.data;
    },
    register: async (username, password, role = 'user') => {
        const response = await api.post('/user.php/register', { username, password, role });
        return response.data;
    },
    getAll: async () => {
        const response = await api.get('/user.php/list');
        return response.data;
    },
    getById: async (userId) => {
        const response = await api.get(`/user.php/get?id=${userId}`);
        return response.data;
    },
    update: async (userId, username, role) => {
        const response = await api.post('/user.php/update', { user_id: userId, username, role });
        return response.data;
    },
    delete: async (userId) => {
        const response = await api.post('/user.php/delete', { user_id: userId });
        return response.data;
    },
    changePassword: async (userId, oldPassword, newPassword) => {
        const response = await api.post('/user.php/change-password', { 
            user_id: userId, 
            old_password: oldPassword, 
            new_password: newPassword 
        });
        return response.data;
    }
};