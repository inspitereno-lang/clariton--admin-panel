import api from './api';

export interface Banner {
    _id: string;
    imageUrl: string;
    status: 'Active' | 'Inactive';
    priority: number;
    createdAt: string;
    updatedAt: string;
}

export const bannerService = {
    createBanner: async (formData: FormData) => {
        const response = await api.post('/banners', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getAllBanners: async () => {
        const response = await api.get('/banners');
        return response.data;
    },

    getActiveBanners: async () => {
        const response = await api.get('/banners/active');
        return response.data;
    },

    updateBanner: async (id: string, formData: FormData) => {
        const response = await api.put(`/banners/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteBanner: async (id: string) => {
        const response = await api.delete(`/banners/${id}`);
        return response.data;
    },
};
