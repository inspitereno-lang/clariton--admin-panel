import api from './api';

export const orderService = {
    getAllOrders: async (page = 1, limit = 10, status?: string | null, search?: string) => {
        let url = `/orders?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        if (search) url += `&search=${search}`;
        const response = await api.get(url);
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
