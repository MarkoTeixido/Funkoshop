"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaFilePdf, FaFileCsv, FaCalendar } from "react-icons/fa6";
import Swal from 'sweetalert2';

export default function AdminReports() {
    const { token } = useAuth();

    const handleDownload = (period: string) => {
        // Here we would trigger a real download. 
        // For prototype, we verify permission and show alert or open JSON in new tab
        const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/reports?period=${period}`;

        // Check connectivity first or just open
        Swal.fire({
            title: 'Generando Reporte...',
            text: `Descargando reporte de: ${period}`,
            icon: 'info',
            timer: 2000,
            showConfirmButton: false
        });

        // Open JSON in new tab as "download" verification
        window.open(url, '_blank');
    };

    return (
        <div className="text-dark">
            <h2 className="text-[3.2rem] font-bold uppercase mb-8">Reportes y Estadísticas</h2>

            <div className="bg-white p-8 rounded-[10px] shadow-sm border border-gray-200">
                <h3 className="text-[2rem] font-bold mb-6 border-b pb-4 text-gray-600">Descargar Reportes de Ventas</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ReportCard title="Último Día" icon={<FaCalendar />} onClick={() => handleDownload('day')} />
                    <ReportCard title="Última Semana" icon={<FaCalendar />} onClick={() => handleDownload('week')} />
                    <ReportCard title="Último Mes" icon={<FaCalendar />} onClick={() => handleDownload('month')} />
                    <ReportCard title="Anual" icon={<FaCalendar />} onClick={() => handleDownload('year')} />
                </div>
            </div>
        </div>
    );
}

function ReportCard({ title, icon, onClick }: { title: string, icon: React.ReactNode, onClick: () => void }) {
    return (
        <div onClick={onClick} className="border border-gray-200 p-6 rounded-[10px] hover:shadow-lg transition-all cursor-pointer flex flex-col items-center gap-4 group hover:bg-gray-50 bg-white">
            <div className="text-[3.2rem] text-primary group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <p className="font-bold text-[1.6rem] text-dark uppercase">{title}</p>
            <span className="text-[1.2rem] text-blue-500 font-medium flex items-center gap-1">
                <FaFileCsv /> CSV / JSON
            </span>
        </div>
    );
}
