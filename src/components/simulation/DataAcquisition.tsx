'use client';

import { useState } from 'react';
import { useSimulationStore } from '@/lib/store';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ScatterChart, Scatter
} from 'recharts';
import { Download, PlayCircle } from 'lucide-react';
import { calculateSimulation } from '@/lib/simulation/thermoelectricModel';

export default function DataAcquisition() {
    const { inputs } = useSimulationStore();
    const [variable, setVariable] = useState<'sandTempPeak' | 'seebeckCoefficient'>('sandTempPeak');
    const [range, setRange] = useState({ start: 50, end: 100, step: 5 });
    const [data, setData] = useState<any[]>([]);

    const runSweep = () => {
        const results = [];
        let current = range.start;

        // Safety check for infinite loops
        if (range.step <= 0) return;

        while (current <= range.end) {
            // Create temp inputs
            const tempInputs = { ...inputs, [variable]: current };
            const simResult = calculateSimulation(tempInputs);

            results.push({
                value: Number(current.toFixed(2)),
                efficiency: simResult.results.averageEfficiency,
                energy: simResult.results.totalEnergy,
                savings: simResult.results.totalSavings
            });

            current += range.step;
        }
        setData(results);
    };

    const exportCSV = () => {
        if (data.length === 0) return;
        const header = ['Value', 'Efficiency (%)', 'Energy (Wh)', 'Savings (Rp)'];
        const rows = data.map(d => [d.value, d.efficiency, d.energy, d.savings].join(','));
        const csvContent = "data:text/csv;charset=utf-8," + [header.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `CDTH_Sweep_${variable}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#295289]">Data Acquisition System</h3>
                <div className="flex gap-2">
                    <button
                        onClick={runSweep}
                        className="px-4 py-2 bg-[#295289] text-white rounded-lg flex items-center gap-2 hover:bg-blue-900 transition-colors"
                    >
                        <PlayCircle size={16} /> Run Sweep
                    </button>
                    <button
                        onClick={exportCSV}
                        disabled={data.length === 0}
                        className="px-4 py-2 bg-slate-100 text-[#295289] rounded-lg flex items-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-600 block mb-1">Control Variable</label>
                        <select
                            value={variable}
                            onChange={(e) => setVariable(e.target.value as any)}
                            className="w-full p-2 rounded-lg border border-slate-200 text-sm"
                        >
                            <option value="sandTempPeak">Sand Peak Temp (°C)</option>
                            <option value="seebeckCoefficient">Seebeck Coefficient (V/K)</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="text-xs text-slate-500">Start</label>
                            <input type="number" value={range.start} onChange={e => setRange({ ...range, start: Number(e.target.value) })} className="w-full p-2 border rounded text-sm" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500">End</label>
                            <input type="number" value={range.end} onChange={e => setRange({ ...range, end: Number(e.target.value) })} className="w-full p-2 border rounded text-sm" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500">Step</label>
                            <input type="number" value={range.step} onChange={e => setRange({ ...range, step: Number(e.target.value) })} className="w-full p-2 border rounded text-sm" />
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 min-h-[300px] bg-slate-50 rounded-lg border border-slate-200 p-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 40, left: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="value" label={{ value: variable === 'sandTempPeak' ? 'Temp (°C)' : 'Seebeck (V/K)', position: 'insideBottom', offset: -5 }} />
                            <YAxis yAxisId="left" label={{ value: 'Energy (Wh)', angle: -90, position: 'insideLeft' }} />
                            <YAxis yAxisId="right" orientation="right" label={{ value: 'Efficiency (%)', angle: 90, position: 'insideRight' }} />
                            <Tooltip />
                            <Legend verticalAlign="top" height={36} />
                            <Line yAxisId="left" type="monotone" dataKey="energy" stroke="#295289" name="Energy (Wh)" />
                            <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#f2c711" name="Efficiency (%)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
