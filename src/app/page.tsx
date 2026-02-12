'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Activity, Zap, BarChart3 } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#eff6ff] flex flex-col relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#295289]/10 to-transparent" />
                <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#f2c711]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#295289]/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 py-20 z-10 flex-1 flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 mb-8 text-sm font-semibold text-[#295289]">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f2c711] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f2c711]"></span>
                        </span>
                        Next-Gen Coastal Energy Simulation
                    </div>

                    <h1 className="text-6xl md:text-7xl font-black text-[#295289] mb-6 leading-tight tracking-tight">
                        Advanced Coastal <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#295289] via-[#f2c711] to-[#295289]">Energy Harvesting</span>
                    </h1>

                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Simulate the thermodynamic potential of Indonesia's coastline. High-fidelity modeling of
                        Seebeck effect efficiency under dynamic environmental conditions.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <Link href="/simulation">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-8 py-4 bg-[#295289] text-white rounded-full font-bold text-lg shadow-xl shadow-[#295289]/20 flex items-center gap-3 overflow-hidden"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                Launch Simulator
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>

                        <Link href="/documentation">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-[#295289] border border-[#295289]/20 rounded-full font-bold text-lg hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                View Documentation
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
                    {[
                        {
                            icon: Zap,
                            title: "Physics Core",
                            desc: "Accurate thermoelectric modeling with transient sand-temp analysis."
                        },
                        {
                            icon: Activity,
                            title: "Real-time Analytics",
                            desc: "Live LCOE estimation and efficiency tracking dashboard."
                        },
                        {
                            icon: BarChart3,
                            title: "Data Acquisition",
                            desc: "Perform parameter sweeps and export datasets for research."
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white hover:border-[#f2c711]/50 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-[#eff6ff] rounded-xl flex items-center justify-center text-[#295289] mb-4 group-hover:scale-110 transition-transform">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-[#295289] mb-2">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
