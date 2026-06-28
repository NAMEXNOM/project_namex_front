const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const fetchCustom = async (endpoint: string, options: RequestInit = {}) => {
    // Esto une la URL base con el endpoint (ej: /api + /auth/login)
    return fetch(`${API_URL}${endpoint}`, options);
};
