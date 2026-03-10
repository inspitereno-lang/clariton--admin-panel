import api from './api';

export interface ProductBanner {
    _id: string;
    productImage: string;
    title: string;
    description: string;
    buttonText: string;
    link: string;
    order: number;
    status: 'Active' | 'Inactive';
    createdAt: string;
    updatedAt: string;
}

export const productBannerService = {
    createBanner: async (formData: FormData) => {
        const response = await api.post('/product-card-banners', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getAllBanners: async () => {
        const response = await api.get('/product-card-banners/admin');
        return response.data;
    },

    getActiveBanners: async () => {
        const response = await api.get('/product-card-banners');
        return response.data;
    },

    updateBanner: async (id: string, formData: FormData) => {
        const response = await api.put(`/product-card-banners/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteBanner: async (id: string) => {
        const response = await api.delete(`/product-card-banners/${id}`);
        return response.data;
    },
};
