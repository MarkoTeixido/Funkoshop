"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth.types";
import { authUtils } from "@/utils/auth.utils";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User, redirectPath?: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = () => {
            const storedToken = authUtils.getToken();
            const storedUser = authUtils.getUser();

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = (newToken: string, newUser: User, redirectPath: string = "/") => {
        // Service should have already set localStorage, but we ensure it here or rely on service
        // For safety/sync, we set it here too if not using service directly for storage, 
        // but since we defined authUtils to handle storage, we should use it or assume correct usage.
        // We will force update authUtils to be safe.
        authUtils.setToken(newToken);
        authUtils.setUser(newUser);

        setToken(newToken);
        setUser(newUser);
        router.push(redirectPath);
    };

    const logout = () => {
        authUtils.removeToken();
        setToken(null);
        setUser(null);
        router.push("/shop/login");
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
