import { create } from 'zustand';
import api from '@/services/api';


export interface Offer {
    _id: string;
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
    };
    title: string;
    description?: string;
    discount: number;
    discountType: 'percentage' | 'fixed';
    startDate: string;
    endDate: string;
    status: 'Active' | 'Inactive';
    createdAt: string;
    updatedAt: string;
}

interface OfferState {
    offers: Offer[];
    isLoading: boolean;
    error: string | null;
    fetchOffers: () => Promise<void>;
    addOffer: (offerData: any) => Promise<void>;
    updateOffer: (id: string, offerData: any) => Promise<void>;
    deleteOffer: (id: string) => Promise<void>;
}

export const useOfferStore = create<OfferState>((set: any, get: any) => ({
    offers: [],
    isLoading: false,
    error: null,

    fetchOffers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/offers');
            set({ offers: response.data.data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to pull offers',
                isLoading: false,
            });
        }
    },

    addOffer: async (offerData: any) => {
        set({ isLoading: true, error: null });
        try {
            await api.post('/offers', offerData);
            await get().fetchOffers();
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to push offer',
                isLoading: false,
            });
            throw error;
        }
    },

    updateOffer: async (id: string, offerData: any) => {
        set({ isLoading: true, error: null });
        try {
            await api.put(`/offers/${id}`, offerData);
            await get().fetchOffers();
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to put offers',
                isLoading: false,
            });
            throw error;
        }
    },

    deleteOffer: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/offers/${id}`);
            await get().fetchOffers();
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to prune offer',
                isLoading: false,
            });
            throw error;
        }
    }
}));
