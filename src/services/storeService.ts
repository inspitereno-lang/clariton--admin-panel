import api from './api';

export const storeService = {
    getStores: async () => {
        const response = await api.get('/stores');
        // Transform backend 'hours' array to frontend 'operatingHours' object if needed
        // But since the UI expects the object, we'll transform it here or in the hook
        return response.data.data;
    },

    addStore: async (storeData: FormData) => {
        const response = await api.post('/stores', storeData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    updateStore: async (id: string, storeData: FormData) => {
        const response = await api.put(`/stores/${id}`, storeData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    deleteStore: async (id: string) => {
        const response = await api.delete(`/stores/${id}`);
        return response.data;
    },
};
