'use client';

import { useSimulationStore } from '@/lib/store';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Zap, Wind, Waves, Battery } from 'lucide-react';
import { useEffect, useState } from 'react';

const Layer = ({ title, children, color, style, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className={`p-4 mb-4 relative rounded-lg border border-white/10 shadow-lg group hover:scale-[1.02] transition-transform duration-300`}
        style={style}
    >
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${color} rounded-l-lg`} />
        <h4 className={clsx(
            "text-xs font-bold mb-2 tracking-widest uppercase flex items-center gap-2",
            color === "bg-white" ? "text-slate-800" : "text-white/50" // Dark text for white background
        )}>
            {title}
        </h4>
        {children}
    </motion.div>
);

export default function BlueprintView() {
    const { getCurrentData, timeOfDay } = useSimulationStore();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        setData(getCurrentData());
    }, [timeOfDay, getCurrentData]);

    if (!data) return <div className="text-white text-center p-10 font-mono">Initializing Systems...</div>;

    return (
        <div className="bg-[#0f172a] p-6 h-full overflow-y-auto font-sans relative custom-scrollbar">

            <div className="flex justify-between items-end mb-8 border-b border-slate-700 pb-4">
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">CDTH SCHEMATIC</h3>
                    <p className="text-slate-400 text-sm">Layer-by-Layer Thermal Analysis</p>
                </div>
                <div className="text-right">
                    <div className="text-[#f2c711] font-mono text-xl">{data.power} mW</div>
                    <div className="text-xs text-slate-500 uppercase">Power Output</div>
                </div>
            </div>

            <div className="space-y-1">

                {/* 5. Environment (Air) */}
                <Layer
                    title="AMBIENT AIRFLOW (Ta)"
                    color="bg-cyan-400"
                    delay={0.1}
                    style={{ background: 'linear-gradient(180deg, rgba(34,211,238,0.1) 0%, rgba(15,23,42,0) 100%)' }}
                >
                    <div className="flex justify-between items-center text-cyan-200/80">
                        <div className="flex items-center gap-3">
                            <Wind size={24} className="animate-pulse opacity-50" />
                            <span className="text-3xl font-light">{data.tempAir}°C</span>
                        </div>
                        <div className="text-xs text-right opacity-50 font-mono">
                            CONVECTIVE COOLING<br />V_wind = ~3.5 m/s
                        </div>
                    </div>
                </Layer>

                {/* 4. Heat Sink */}
                <Layer
                    title="ALUMINUM HEAT SINK"
                    color="bg-blue-600"
                    delay={0.2}
                    style={{ background: 'linear-gradient(90deg, #1e293b 0%, #334155 50%, #1e293b 100%)' }}
                >
                    <div className="h-16 w-full flex justify-between items-end px-2 pb-1 relative">
                        {/* Fins */}
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-2 h-12 bg-gradient-to-t from-slate-400 to-slate-600 rounded-t-sm" />
                        ))}
                        <div className="absolute top-2 right-4 text-xs text-slate-400 font-mono">Al-6061 Alloy</div>
                    </div>
                </Layer>

                {/* 3. TEG Core */}
                <Layer
                    title="THERMOELECTRIC GENERATOR (Bi2Te3)"
                    color="bg-white"
                    delay={0.3}
                    style={{ background: 'linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%)' }}
                >
                    <div className="flex justify-between items-center px-4 py-2">
                        <div className="flex gap-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-8 h-8 bg-white border border-slate-300 shadow-inner flex items-center justify-center rounded">
                                    <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-red-400' : 'bg-blue-400'}`} />
                                </div>
                            ))}
                        </div>
                        <div className="text-right">
                            <div className="text-slate-800 font-bold font-mono">{data.voltage} mV</div>
                            <div className="text-[10px] text-slate-800 tracking-wider font-bold">SEEBECK VOLTAGE</div>
                        </div>
                    </div>
                </Layer>

                {/* 2. Protection */}
                <Layer
                    title="PROTECTION PLATE"
                    color="bg-slate-500"
                    delay={0.4}
                    style={{ background: '#475569' }}
                >
                    <div className="h-1 w-full bg-slate-300/30 rounded" />
                </Layer>

                {/* 1. Heat Source (Sand) */}
                <Layer
                    title="COASTAL SAND BED (Ts)"
                    color="bg-orange-500"
                    delay={0.5}
                    style={{ background: 'linear-gradient(180deg, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0.2) 100%)' }}
                >
                    <div className="flex justify-between items-center text-orange-200/90">
                        <div className="flex items-center gap-3">
                            <Waves size={24} className="text-orange-400" />
                            <span className="text-3xl font-light text-orange-400">{data.tempSand}°C</span>
                        </div>
                        <div className="text-xs text-right opacity-50 font-mono text-orange-300">
                            GEOTHERMAL MASS<br />High Thermal Inertia
                        </div>
                    </div>
                </Layer>

                {/* Output Connection */}
                <div className="mt-4 flex justify-between items-center bg-black/40 p-3 rounded-lg border border-[#f2c711]/20">
                    <div className="flex items-center gap-2 text-[#f2c711]">
                        <Battery size={18} />
                        <span className="text-xs font-bold">LOAD CONNECTION</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-[#f2c711]/20 mx-4 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#f2c711] rounded-full shadow-[0_0_10px_#f2c711]" />
                    </div>
                    <Zap size={18} className="text-[#f2c711] animate-pulse" />
                </div>

            </div>
        </div>
    );
}
