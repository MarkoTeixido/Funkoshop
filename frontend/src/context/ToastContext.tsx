"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Toast, ToastAction, ToastType } from "@/types/toast.types";
import { AnimatePresence } from "framer-motion";
import ToastItem from "@/components/ui/Toast";

interface ToastContextType {
    addToast: (message: string, type?: ToastType, description?: string, action?: ToastAction) => void;
    success: (message: string, description?: string, action?: ToastAction) => void;
    error: (message: string, description?: string, action?: ToastAction) => void;
    info: (message: string, description?: string, action?: ToastAction) => void;
    warning: (message: string, description?: string, action?: ToastAction) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType = 'info', description?: string, action?: ToastAction) => {
        const id = Math.random().toString(36).substring(7);
        const newToast: Toast = { id, message, type, description, action };

        setToasts((prev) => [...prev, newToast]);

        // Auto remove after 5 seconds if no action
        if (!action) {
            setTimeout(() => {
                removeToast(id);
            }, 5000);
        } else {
            // If there is an action, give it a bit longer, e.g. 8s
            setTimeout(() => {
                removeToast(id);
            }, 8000);
        }
    }, [removeToast]);

    const success = (msg: string, desc?: string, action?: ToastAction) => addToast(msg, 'success', desc, action);
    const error = (msg: string, desc?: string, action?: ToastAction) => addToast(msg, 'error', desc, action);
    const info = (msg: string, desc?: string, action?: ToastAction) => addToast(msg, 'info', desc, action);
    const warning = (msg: string, desc?: string, action?: ToastAction) => addToast(msg, 'warning', desc, action);

    return (
        <ToastContext.Provider value={{ addToast, success, error, info, warning }}>
            {children}

            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
                <div className="pointer-events-auto flex flex-col gap-3 items-end">
                    <AnimatePresence>
                        {toasts.map((toast) => (
                            <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
