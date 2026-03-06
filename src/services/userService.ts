import api from './api';
import type { User } from '@/types';

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
    },
    updateProfile: async (data: Partial<User>) => {
        const response = await api.put('/user/profile', data);
        return response.data;
    },
    changePassword: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
        const response = await api.put('/user/change-password', data);
        return response.data;
    }
};
