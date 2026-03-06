import api from './api';

export const appointmentService = {
    getAllAppointments: async (page = 1, limit = 10, date?: string, status?: string, storeId?: string) => {
        let url = `/appointments?page=${page}&limit=${limit}`;
        if (date) url += `&date=${date}`;
        if (status) url += `&status=${status}`;
        if (storeId) url += `&storeId=${storeId}`;
        const response = await api.get(url);
        return response.data;
    },
    getAppointmentById: async (id: string) => {
        const response = await api.get(`/appointments/${id}`);
        return response.data;
    },
    updateAppointmentStatus: async (id: string, status: string) => {
        const response = await api.patch(`/appointments/${id}/status`, { status });
        return response.data;
    }
};
