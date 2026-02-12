'use client';

import { useSimulationStore } from '@/lib/store';
// Removed Slider import
import { Play, Pause, RotateCcw, Download, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function ControlPanel() {
    const { inputs, setInputs, runSimulation, timeOfDay, setTimeOfDay, advanceTime, simulationData } = useSimulationStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(50); // Default Fast (50ms)
    const [feedback, setFeedback] = useState('');

    // Auto-run simulation on mount
    useEffect(() => {
        runSimulation();
    }, [runSimulation]);

    // Animation Loop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                advanceTime(0.1);
            }, speed); // Dynamic speed
        }
        return () => clearInterval(interval);
    }, [isPlaying, setTimeOfDay, advanceTime, speed]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 h-full flex flex-col gap-6">
            <div>
                <h2 className="text-xl font-bold text-[#295289] mb-1">Configuration</h2>
                <p className="text-sm text-slate-500">Adjust CDTH parameters</p>
            </div>

            {/* Location Input */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Location Profile</label>
                <div className="grid grid-cols-2 gap-2">
                    {['Kuta', 'Tanah Lot'].map((loc) => (
                        <button
                            key={loc}
                            onClick={() => {
                                setInputs({ location: loc as 'Kuta' | 'Tanah Lot' });
                                setFeedback(loc === 'Tanah Lot' ? 'Wind Cooling Enabled: Night temps reduced.' : 'Tropical Profile: Standard params applied.');
                                setTimeout(() => setFeedback(''), 3000);
                            }}
                            className={clsx(
                                "py-2 px-4 rounded-lg text-sm font-semibold transition-all",
                                inputs.location === loc
                                    ? "bg-[#295289] text-white shadow-md"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            {loc}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-slate-500">
                    {inputs.location === 'Kuta' ? 'High Insolation (Tropical)' : 'Windy Coastal Area (Cooler Nights)'}
                </p>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-700">Sand Peak Temp</span>
                        <span className="font-bold text-[#295289]">{inputs.sandTempPeak}°C</span>
                    </div>
                    <input
                        type="range"
                        min="50"
                        max="100"
                        value={inputs.sandTempPeak}
                        onChange={(e) => setInputs({ sandTempPeak: Number(e.target.value) })}
                        className="w-full accent-[#295289] h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-700">Seebeck Coefficient</span>
                        <span className="font-bold text-[#295289]">{inputs.seebeckCoefficient} V/K</span>
                    </div>
                    <input
                        type="range"
                        min="0.01"
                        max="0.1"
                        step="0.01"
                        value={inputs.seebeckCoefficient}
                        onChange={(e) => setInputs({ seebeckCoefficient: Number(e.target.value) })}
                        className="w-full accent-[#295289] h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-700">Project Scale (Units)</span>
                        <span className="font-bold text-[#295289]">{inputs.moduleCount.toLocaleString()}</span>
                    </div>
                    <input
                        type="range"
                        min="100"
                        max="10000"
                        step="100"
                        value={inputs.moduleCount}
                        onChange={(e) => setInputs({ moduleCount: Number(e.target.value) })}
                        className="w-full accent-[#295289] h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>

            {/* Time Control */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-[#295289]">Time Simulation</span>
                    <span className="text-xs bg-[#295289] text-white px-2 py-1 rounded">
                        {Math.floor(timeOfDay)}:00
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 rounded-full bg-[#f2c711] text-[#295289] hover:bg-yellow-400 transition-colors"
                    >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>

                    {/* Speed Control */}
                    <div className="flex bg-slate-200 rounded-lg p-1">
                        {[
                            { label: '1x', val: 200, name: 'Slow' },
                            { label: '2x', val: 100, name: 'Normal' },
                            { label: '4x', val: 50, name: 'Fast' }
                        ].map((s) => (
                            <button
                                key={s.name}
                                onClick={() => setSpeed(s.val)}
                                className={clsx(
                                    "px-2 py-0.5 text-[10px] font-bold rounded transition-all",
                                    speed === s.val ? "bg-white text-[#295289] shadow" : "text-slate-500 hover:text-slate-700"
                                )}
                                title={s.name}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="24"
                        step="0.1"
                        value={timeOfDay}
                        onChange={(e) => setTimeOfDay(Number(e.target.value))}
                        className="w-full accent-[#f2c711] h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>

            {/* Economic Inputs */}
            <div className="space-y-4 border-t border-slate-100 pt-4">
                <h3 className="text-sm font-bold text-[#295289] flex items-center gap-2">
                    Economic Parameters <Info size={14} className="text-slate-400" />
                </h3>
                <div>
                    <label className="text-xs text-slate-500">System Cost (IDR)</label>
                    <input
                        type="number"
                        value={inputs.systemCost}
                        onChange={e => setInputs({ systemCost: Number(e.target.value) })}
                        className="w-full p-2 border border-slate-200 rounded text-sm"
                    />
                </div>
            </div>

            <div className="mt-auto space-y-3">
                {feedback && (
                    <div className="bg-green-100 text-green-700 p-2 rounded text-xs text-center animate-pulse">
                        {feedback}
                    </div>
                )}
                <button
                    onClick={() => {
                        runSimulation();
                        setFeedback('Model Recalculated!');
                        setTimeout(() => setFeedback(''), 2000);
                    }}
                    className="w-full py-3 bg-[#295289] text-white rounded-lg font-bold hover:bg-[#1a365d] transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                    <RotateCcw size={18} />
                    Recalculate Model
                </button>

                <button
                    onClick={() => {
                        const header = ['Time', 'SandTemp', 'AirTemp', 'Voltage(mV)', 'Power(mW)'];
                        const rows = simulationData.map(d => [d.time, d.tempSand, d.tempAir, d.voltage, d.power].join(','));
                        const csv = "data:text/csv;charset=utf-8," + [header.join(','), ...rows].join('\n');
                        const link = document.createElement("a");
                        link.href = encodeURI(csv);
                        link.download = "CDTH_Simulation_Full.csv";
                        link.click();
                    }}
                    className="w-full py-2 bg-slate-100 text-[#295289] rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 border border-[#295289]/20"
                >
                    <Download size={16} />
                    Download CSV
                </button>
            </div>
        </div>
    );
}
