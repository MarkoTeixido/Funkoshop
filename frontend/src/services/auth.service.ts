import { api } from './api';
import { authUtils } from '@/utils/auth.utils';
import { LoginResponse, RegisterDTO, User } from '@/types/auth.types';

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', { email, password });
        const data = response.data;

        if (data.token) {
            authUtils.setToken(data.token);
            authUtils.setUser(data.user);
        }
        return data;
    },

    register: async (data: RegisterDTO): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/register', data);
        // Auto login after register if API returns token
        if (response.data.token) {
            authUtils.setToken(response.data.token);
            authUtils.setUser(response.data.user);
        }
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.warn('Logout API failed, clearing local state anyway', error);
        } finally {
            authUtils.removeToken();
        }
    },

    getProfile: async (): Promise<User> => {
        const response = await api.get<{ data: User }>('/auth/profile');
        return response.data.data; // Adapting structure: axios data -> api response data
    }
};
