import fetchApi from "./api";
import type { County } from "./models";

export const countiesApi = {
    getAll: async (): Promise<County[]> => {
        const response = await fetchApi(`/counties`);
        if (!response.ok) {
            throw new Error('Failed to fetch counties');
        }
        return response.json();
    },

    getById: async (countyId: number): Promise<County> => {
        const response = await fetchApi(`/counties/${countyId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch county');
        }
        return response.json();
    },
};
