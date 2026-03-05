import api from './api';

export const authService = {
    login: async (Email: string, password: string) => {
        const response = await api.post('/user/login', { Email, password });
        return response.data;
    },
};
