// utils/api.ts
declare const process: any;

export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/docs';

export const fetchCustom = async (endpoint: string, options: RequestInit = {}) => {
    return fetch(`${API_URL}${endpoint}`, options);
};
