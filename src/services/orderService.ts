import api from './api';

export const orderService = {
    getAllOrders: async (page = 1, limit = 10) => {
        const response = await api.get(`/orders?page=${page}&limit=${limit}`);
        return response.data;
    },
    getOrderById: async (id: string) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },
    updateOrderItemStatus: async (orderId: string, productId: string, status: string) => {
        const response = await api.patch(`/orders/${orderId}/item/${productId}/status`, { status });
        return response.data;
    },
    deleteOrder: async (id: string) => {
        const response = await api.delete(`/orders/${id}`);
        return response.data;
    },
    getOrderStats: async () => {
        const response = await api.get('/orders/stats');
        return response.data;
    }
};
