import api from './api';

export const languageService = {
    getLanguages: async () => {
        const response = await api.get('/languages');
        return response.data;
    },

    addLanguage: async (name: string) => {
        const response = await api.post('/languages', { name });
        return response.data;
    },

    deleteLanguage: async (id: string) => {
        const response = await api.delete(`/languages/${id}`);
        return response.data;
    }
};
