import api from './api';

export const userService = {
    getAllUsers: async (params?: { page?: number; limit?: number; search?: string }) => {
        const response = await api.get('/user', { params });
        return response.data;
    },
    getUserById: async (id: string) => {
        const response = await api.get(`/user/${id}`);
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data;
    }
};
