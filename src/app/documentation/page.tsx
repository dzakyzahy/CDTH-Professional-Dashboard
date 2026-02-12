import clsx from 'clsx';

const MathBlock = ({ label, formula }: { label: string, formula: string }) => (
    <div className="my-6 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{label}</p>
        <div className="font-mono text-lg md:text-xl text-[#295289] overflow-x-auto">
            {formula}
        </div>
    </div>
);

export default function DocumentationPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-[#295289] mb-4">Documentation & Methodology</h1>
                <p className="text-lg text-slate-600">Technical reference for the CDTH Digital Twin Simulator.</p>
            </div>

            <div className="space-y-12">

                {/* Section 1: Architecture */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-[#295289] mb-6 flex items-center gap-3">
                        <span className="bg-[#f2c711] w-2 h-8 rounded-full"></span>
                        System Architecture
                    </h2>
                    <div className="prose prose-slate max-w-none">
                        <p>
                            The CDTH Simulator leverages a Client-Side Time-Step Physics Engine within a Next.js framework.
                            It follows the <strong>Model-View-Controller (MVC)</strong> pattern:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4 text-slate-600">
                            <li><strong>Model (Physics Engine):</strong> <code>thermoelectricModel.ts</code> handles all thermodynamic calculations including heat transfer, Seebeck voltage generation, and power output estimation.</li>
                            <li><strong>View (Presentation):</strong>
                                <ul className="list-circle pl-5 mt-1">
                                    <li><strong>3D Scene:</strong> React Three Fiber (Canvas) for environmental visualization.</li>
                                    <li><strong>Dashboard:</strong> Recharts for real-time data plotting.</li>
                                </ul>
                            </li>
                            <li><strong>Controller (State):</strong> Zustand store manages user inputs, simulation time, and data flow between components.</li>
                        </ul>
                    </div>
                </section>

                {/* Section 2: Physics Model */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-[#295289] mb-6 flex items-center gap-3">
                        <span className="bg-[#295289] w-2 h-8 rounded-full"></span>
                        Physics & Numerical Methods
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">1. Thermal Modeling</h3>
                            <p className="text-slate-600">
                                We utilize a diurnal sinusoidal approximation to model the sand and air temperature fluctuations.
                                Included is a phase shift to account for the thermal mass of the sand.
                            </p>
                            <div className="my-6 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Sand Temperature Equation</p>
                                <code className="font-mono text-lg text-[#295289]">
                                    T_sand(t) = (T_peak - 15) + 15 * sin((t - 14) * PI / 12)
                                </code>
                            </div>
                            <p className="text-sm text-slate-500 italic">
                                *Peaking at 14:00 (2:00 PM) to reflect thermal mass lag of coastal sand.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">2. Thermoelectric Generation</h3>
                            <p className="text-slate-600">
                                The open-circuit voltage (Voc) is derived from the Seebeck effect, proportional to the temperature differential (Delta T):
                            </p>
                            <div className="my-6 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Seebeck Voltage</p>
                                <code className="font-mono text-lg text-[#295289]">
                                    Voc = | S * (T_hot - T_cold) |
                                </code>
                            </div>
                            <ul className="list-disc pl-5 text-sm text-slate-600 mt-2 space-y-1">
                                <li>S: Seebeck Coefficient (V/K) - Material property</li>
                                <li>T_hot: Sand Temperature (Heat Source)</li>
                                <li>T_cold: Ambient Air Temperature (Heat Sink)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">3. Power & Efficiency</h3>
                            <p className="text-slate-600">
                                Maximum Power Point Tracking (MPPT) logic assumes load matching (R_load = R_internal).
                            </p>
                            <div className="my-6 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Maximum Power Output</p>
                                <code className="font-mono text-lg text-[#295289]">
                                    P_max = (Voc / 2)^2 / R_internal
                                </code>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Location Profiles */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-[#295289] mb-6 flex items-center gap-3">
                        <span className="bg-cyan-500 w-2 h-8 rounded-full"></span>
                        Environmental Profiles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-[#eff6ff] rounded-xl border border-blue-100">
                            <h3 className="font-bold text-[#295289] text-lg mb-2">Kuta Profile (Standard)</h3>
                            <p className="text-slate-600">
                                Represents average tropical coastal conditions. Moderate wind speeds allow for standard convective cooling.
                                Used as the baseline for system calibration.
                            </p>
                        </div>
                        <div className="p-6 bg-[#f0fdf4] rounded-xl border border-green-100">
                            <h3 className="font-bold text-green-800 text-lg mb-2">Tanah Lot Profile (High Wind)</h3>
                            <p className="text-slate-600">
                                Characterized by stronger coastal winds, especially at night.
                                This enhances the cooling efficiency of the heat sink (T_cold decreases faster),
                                increasing Delta T and potentially boosting night-time power generation.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 4: KPI Definitions */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-[#295289] mb-6 flex items-center gap-3">
                        <span className="bg-[#f2c711] w-2 h-8 rounded-full"></span>
                        Economic & Environmental Metrics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="p-4 border border-slate-200 rounded-xl">
                                <h4 className="font-bold text-[#295289] mb-2">Levelized Cost of Energy (LCOE)</h4>
                                <p className="text-sm text-slate-600 mb-2">
                                    The average net present cost of electricity generation over the system's lifetime.
                                </p>
                                <code className="bg-slate-100 p-1 rounded text-xs">LCOE = Total Lifetime Cost / Lifetime Energy</code>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 border border-slate-200 rounded-xl">
                                <h4 className="font-bold text-[#295289] mb-2">Carbon Avoidance</h4>
                                <p className="text-sm text-slate-600">
                                    Calculated based on Indonesia's grid emission factor (Coal baseline).
                                    <br /><strong>Factor:</strong> 0.85 kgCO₂/kWh
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
