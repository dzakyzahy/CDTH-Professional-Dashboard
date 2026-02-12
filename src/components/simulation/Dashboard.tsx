'use client';

import { useSimulationStore } from '@/lib/store';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, ComposedChart, Line, Bar } from 'recharts';
import { Zap, BatteryCharging, Leaf, DollarSign } from 'lucide-react';
import clsx from 'clsx';
import { useState, useMemo } from 'react';

const KPICard = ({ title, value, unit, icon: Icon, colorClass }: any) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <div className="flex items-baseline gap-1 mt-1">
                <h3 className={clsx("text-2xl font-bold", colorClass)}>{value}</h3>
                <span className="text-xs text-slate-400">{unit}</span>
            </div>
        </div>
        <div className={clsx("p-3 rounded-full bg-opacity-10", colorClass.replace('text-', 'bg-'))}>
            <Icon size={24} className={colorClass} />
        </div>
    </div>
);

export default function Dashboard({ initialTab = 'performance' }: { initialTab?: 'performance' | 'economics' }) {
    const { simulationData, results, timeOfDay, inputs } = useSimulationStore();
    const [activeTab, setActiveTab] = useState<'performance' | 'economics'>(initialTab);

    const maxVoltage = useMemo(() => {
        if (simulationData.length === 0) return 0;
        return Math.max(...simulationData.map(d => d.voltage)).toFixed(1);
    }, [simulationData]);

    // CO2 Saved factor: 0.85 kg CO2 per kWh
    const co2Saved = ((results.totalEnergy / 1000) * 0.85).toFixed(3);

    // Economic Data for Composed Chart (BEP Analysis)
    const economicChartData = useMemo(() => {
        const years = 15; // Project timeline
        const annualSavings = results.totalSavings * 365; // Daily * 365
        const data = [];
        let cumulativeSavings = 0;

        for (let i = 0; i <= years; i++) {
            if (i > 0) cumulativeSavings += annualSavings; // Simple linear accumulation
            data.push({
                year: `Year ${i}`,
                savings: cumulativeSavings / 1000000, // In Millions
                cost: inputs.systemCost / 1000000,
                net: (cumulativeSavings - inputs.systemCost) / 1000000
            });
        }
        return data;
    }, [inputs.systemCost, results.totalSavings]);

    // Custom Tooltip for Performance to show Delta T
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const sand = payload.find((p: any) => p.dataKey === 'tempSand')?.value;
            const air = payload.find((p: any) => p.dataKey === 'tempAir')?.value;
            const delta = sand && air ? (sand - air).toFixed(1) : 0;

            return (
                <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-lg text-sm">
                    <p className="font-bold text-slate-700 mb-2">{label}:00</p>
                    {payload.map((p: any) => (
                        <p key={p.name} style={{ color: p.color }} className="flex justify-between gap-4">
                            <span>{p.name}:</span>
                            <span className="font-mono font-bold">{p.value} {p.unit}</span>
                        </p>
                    ))}
                    <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between gap-4 text-purple-600 font-bold">
                        <span>Delta T (Δ):</span>
                        <span className="font-mono">{delta} °C</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard title="Max Voltage" value={maxVoltage} unit="mV" icon={Zap} colorClass="text-[#f2c711]" />
                <KPICard title="Total Energy" value={results.totalEnergy} unit="Wh" icon={BatteryCharging} colorClass="text-[#295289]" />
                <KPICard title="Carbon Saved" value={co2Saved} unit="kg" icon={Leaf} colorClass="text-green-600" />
                <KPICard title="LCOE" value={`Rp ${results.lcoe}`} unit="/kWh" icon={DollarSign} colorClass="text-purple-600" />
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('performance')}
                    className={clsx("pb-2 px-1 text-sm font-bold transition-colors border-b-2", activeTab === 'performance' ? "border-[#295289] text-[#295289]" : "border-transparent text-slate-500")}
                >
                    Performance
                </button>
                <button
                    onClick={() => setActiveTab('economics')}
                    className={clsx("pb-2 px-1 text-sm font-bold transition-colors border-b-2", activeTab === 'economics' ? "border-[#295289] text-[#295289]" : "border-transparent text-slate-500")}
                >
                    Economics (ROI/LCOE)
                </button>
            </div>

            {/* Main Chart */}
            <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-slate-100 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    {activeTab === 'performance' ? (
                        <AreaChart data={simulationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSand" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f2c711" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f2c711" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorAir" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#cce8f4" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#cce8f4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="time" tickFormatter={(val) => `${val}:00`} stroke="#94a3b8" fontSize={12} />
                            <YAxis yAxisId="temp" stroke="#94a3b8" fontSize={12} unit="°C" />
                            <YAxis yAxisId="power" orientation="right" stroke="#295289" fontSize={12} unit="mW" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <ReferenceLine x={Math.floor(timeOfDay)} stroke="red" strokeDasharray="3 3" label="Current Time" />
                            <Area yAxisId="temp" type="monotone" dataKey="tempSand" name="Sand Temp" stroke="#f2c711" fillOpacity={1} fill="url(#colorSand)" unit="°C" />
                            <Area yAxisId="temp" type="monotone" dataKey="tempAir" name="Air Temp" stroke="#87CEEB" fillOpacity={1} fill="url(#colorAir)" unit="°C" />
                            <Area yAxisId="power" type="monotone" dataKey="power" name="Power Output" stroke="#295289" fill="none" strokeWidth={3} unit="mW" />
                        </AreaChart>
                    ) : (
                        <ComposedChart data={economicChartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis dataKey="year" scale="point" padding={{ left: 20, right: 20 }} />
                            <YAxis unit="M Rp" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="cost" stroke="#ef4444" name="Initial System Cost" strokeDasharray="5 5" />
                            <Area type="monotone" dataKey="savings" fill="#295289" stroke="#295289" fillOpacity={0.3} name="Cumulative Savings" />
                            <Bar dataKey="net" barSize={20} fill="#10b981" name="Net Profit (Projected)" />
                        </ComposedChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
