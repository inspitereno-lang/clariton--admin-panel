import api from './api';

export const slotService = {
    getSlots: async () => {
        const response = await api.get('/slots');
        return response.data;
    },

    addSlot: async (startTime: string, endTime: string) => {
        const response = await api.post('/slots', { startTime, endTime });
        return response.data;
    },

    deleteSlot: async (id: string) => {
        const response = await api.delete(`/slots/${id}`);
        return response.data;
    }
};
