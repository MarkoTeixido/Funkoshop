import React from 'react';
import { IconType } from 'react-icons';

interface StatCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    icon?: IconType;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    alert?: boolean;
    variant?: 'default' | 'blue' | 'emerald' | 'amber' | 'rose' | 'purple';
}

export default function StatCard({ title, value, subtext, icon: Icon, trend, trendValue, alert = false, variant = 'default' }: StatCardProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'blue': return 'bg-blue-100 text-blue-600';
            case 'emerald': return 'bg-emerald-100 text-emerald-600';
            case 'amber': return 'bg-amber-100 text-amber-600';
            case 'rose': return 'bg-rose-100 text-rose-600';
            case 'purple': return 'bg-purple-100 text-purple-600';
            default: return 'bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary';
        }
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-auto min-h-[110px] relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
                <div className="flex flex-col z-10">
                    <span className="text-gray-500 text-xs font-semibold mb-0.5">{title}</span>
                    <h3 className="text-2xl font-extrabold text-dark-bg tracking-tight mt-0.5">{value}</h3>
                </div>
                {Icon && (
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300 ${alert ? 'rotate-12' : ''} ${getVariantStyles()}`}>
                        <Icon />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 mt-2 z-10">
                {trend && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${trend === 'up' ? 'bg-green-100 text-green-600' :
                        trend === 'down' ? 'bg-rose-100 text-rose-600' :
                            'bg-gray-100 text-gray-600'
                        }`}>
                        {trend === 'up' && '↗'}
                        {trend === 'down' && '↘'}
                        {trendValue}
                    </span>
                )}
                {subtext && <span className={`text-[10px] ${alert ? 'text-rose-500 font-bold' : 'text-gray-400'}`}>{subtext}</span>}
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500 -z-0" />
        </div>
    );
}
