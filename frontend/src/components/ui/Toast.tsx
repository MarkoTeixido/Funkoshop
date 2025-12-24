"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { Toast } from "@/types/toast.types";

interface ToastProps {
    toast: Toast;
    onClose: (id: string) => void;
}

const icons = {
    success: <FaCheckCircle className="text-green-500 text-xl" />,
    error: <FaExclamationCircle className="text-red-500 text-xl" />,
    info: <FaInfoCircle className="text-blue-500 text-xl" />,
    warning: <FaExclamationTriangle className="text-yellow-500 text-xl" />
};

const borderColors = {
    success: "border-green-500/50",
    error: "border-red-500/50",
    info: "border-blue-500/50",
    warning: "border-yellow-500/50"
};

export default function ToastItem({ toast, onClose }: ToastProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`w-full md:w-[400px] bg-dark-surface/90 backdrop-blur-md border ${borderColors[toast.type]} p-4 rounded-xl shadow-2xl flex items-start gap-4 relative overflow-hidden`}
        >
            {/* Glossy Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

            <div className="shrink-0 mt-1">{icons[toast.type]}</div>

            <div className="flex-1 min-w-0 z-10">
                <h4 className="font-bold text-white text-sm">{toast.message}</h4>
                {toast.description && (
                    <p className="text-gray-300 text-xs mt-1 leading-relaxed">{toast.description}</p>
                )}
                {toast.action && (
                    <button
                        onClick={toast.action.onClick}
                        className="mt-3 text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/10"
                    >
                        {toast.action.label}
                    </button>
                )}
            </div>

            <button
                onClick={() => onClose(toast.id)}
                className="text-gray-500 hover:text-white transition-colors z-10 shrink-0"
            >
                <FaTimes />
            </button>
        </motion.div>
    );
}
