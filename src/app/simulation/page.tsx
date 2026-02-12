'use client';

import { useState } from 'react';
import BeachScene from "@/components/simulation/BeachScene";
import ControlPanel from "@/components/simulation/ControlPanel";
import Dashboard from "@/components/simulation/Dashboard";
import BlueprintView from "@/components/simulation/BlueprintView";
import DataAcquisition from "@/components/simulation/DataAcquisition";
import { Box, FileSpreadsheet, Layers, MonitorPlay } from 'lucide-react';
import clsx from 'clsx';

export default function SimulationPage() {
  const [activeTab, setActiveTab] = useState<'visual' | 'physics' | 'economics' | 'data'>('visual');

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-5rem)] bg-[#eff6ff]">
      {/* Sidebar Controls */}
      <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 p-4 overflow-y-auto border-b md:border-b-0 md:border-r border-slate-200 bg-white md:bg-transparent custom-scrollbar">
        <ControlPanel />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto custom-scrollbar">

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-white/50 p-1.5 rounded-xl w-fit backdrop-blur-sm sticky top-0 z-20 shadow-sm border border-white/50">
          <button
            onClick={() => setActiveTab('visual')}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'visual' ? "bg-[#295289] text-white shadow-md transform scale-105" : "text-slate-600 hover:bg-white/80"
            )}
          >
            <Box size={16} /> 3D & Blueprint
          </button>
          <button
            onClick={() => setActiveTab('physics')}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'physics' ? "bg-[#295289] text-white shadow-md transform scale-105" : "text-slate-600 hover:bg-white/80"
            )}
          >
            <MonitorPlay size={16} /> Physics Analytics
          </button>
          <button
            onClick={() => setActiveTab('economics')}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'economics' ? "bg-[#295289] text-white shadow-md transform scale-105" : "text-slate-600 hover:bg-white/80"
            )}
          >
            <FileSpreadsheet size={16} /> Economic Analysis
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'data' ? "bg-[#295289] text-white shadow-md transform scale-105" : "text-slate-600 hover:bg-white/80"
            )}
          >
            <Layers size={16} /> Data Acquisition
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-[500px] relative">

          {/* TAB 1: VISUALS (3D + 2D Split or Toggle) */}
          {activeTab === 'visual' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white h-[400px] lg:h-auto z-0">
                <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm pointer-events-none">
                  Live Physics Rendering
                </div>
                <BeachScene />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white h-[400px] lg:h-auto bg-[#0f172a]">
                <BlueprintView />
              </div>
            </div>
          )}

          {/* TAB 2: PHYSICS ANALYTICS */}
          {activeTab === 'physics' && (
            <div className="h-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <h2 className="text-xl font-bold text-[#295289] mb-4">Thermodynamic Performance</h2>
              <div className="h-[calc(100%-2rem)]">
                <Dashboard initialTab="performance" />
              </div>
            </div>
          )}

          {/* TAB 3: ECONOMICS */}
          {activeTab === 'economics' && (
            <div className="h-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <h2 className="text-xl font-bold text-[#295289] mb-4">Economic Feasibility (LCOE/ROI)</h2>
              <div className="h-[calc(100%-2rem)]">
                <Dashboard initialTab="economics" />
              </div>
            </div>
          )}

          {/* TAB 4: DATA ACQUISITION */}
          {activeTab === 'data' && (
            <div className="h-full">
              <DataAcquisition />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
