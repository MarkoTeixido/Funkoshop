export type UserRole = 'user' | 'admin';

export interface User {
    id: number;
    name: string;
    lastname: string;
    email: string;
    role: UserRole;
    is_active: boolean;
    email_verified?: boolean;
    phone?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface LoginResponse {
    success?: boolean;
    message?: string;
    token: string;
    refreshToken?: string;
    user: User;
}

export interface RegisterDTO {
    name: string;
    lastname: string;
    email: string;
    password: string;
    repPassword?: string; // Frontend only validation
}
