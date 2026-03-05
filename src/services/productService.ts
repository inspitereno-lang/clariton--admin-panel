import api from './api';

export const productService = {
    getProducts: async (keyword: string = "", category: string = "") => {
        const response = await api.get(`/products?keyword=${keyword}&category=${category === 'all' ? '' : category}`);
        return response.data.data;
    },

    addProduct: async (productData: FormData) => {
        const response = await api.post('/products', productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    updateProduct: async (id: string, productData: FormData) => {
        const response = await api.put(`/products/${id}`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    deleteProduct: async (id: string) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },
};
