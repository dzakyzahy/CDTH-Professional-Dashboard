import { create } from 'zustand';
import { calculateSimulation } from './simulation/thermoelectricModel';

export interface SimulationInputs {
    location: 'Kuta' | 'Tanah Lot';
    sandTempPeak: number;
    seebeckCoefficient: number;
    conductivity: number;
    // Economic Inputs
    systemCost: number; // Rp (Capital Cost)
    discountRate: number; // %
    lifetime: number; // Years
    moduleCount: number; // Number of units in the array
}

export interface SimulationDataPoint {
    time: number;
    tempSand: number;
    tempAir: number;
    voltage: number;
    power: number;
}

export interface SimulationResults {
    totalEnergy: number; // Wh
    averageEfficiency: number; // %
    totalSavings: number; // Rp
    lcoe: number; // Rp/kWh
    roi: number; // Years
}

export interface SweepResult {
    variableValue: number;
    efficiency: number;
    power: number;
}

interface SimulationState {
    inputs: SimulationInputs;
    simulationData: SimulationDataPoint[];
    results: SimulationResults;
    isSimulating: boolean;
    timeOfDay: number; // 0-24 for visualization

    setInputs: (inputs: Partial<SimulationInputs>) => void;
    runSimulation: () => void;
    setTimeOfDay: (time: number) => void;
    advanceTime: (delta: number) => void;
    getCurrentData: () => SimulationDataPoint | undefined;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
    inputs: {
        location: 'Kuta',
        sandTempPeak: 70, // Default between 60-80
        seebeckCoefficient: 0.05,
        conductivity: 1.5,
        systemCost: 15000000, // 15 Million IDR
        discountRate: 5,
        lifetime: 10,
        moduleCount: 2000 // Default to 2000 units (> Break Even)
    },
    simulationData: [],
    results: {
        totalEnergy: 0,
        averageEfficiency: 0,
        totalSavings: 0,
        lcoe: 0,
        roi: 0
    },
    isSimulating: false,
    timeOfDay: 12, // Start at noon

    setInputs: (newInputs) => {
        set((state) => ({
            inputs: { ...state.inputs, ...newInputs },
        }));
        get().runSimulation(); // Auto-recalculate on input change
    },

    setTimeOfDay: (time) => set({ timeOfDay: time }),

    advanceTime: (delta) => set((state) => ({
        timeOfDay: (state.timeOfDay + delta) >= 24 ? 0 : state.timeOfDay + delta
    })),

    getCurrentData: () => {
        const { simulationData, timeOfDay } = get();
        // Find closest data point
        return simulationData.find(d => Math.abs(d.time - timeOfDay) < 0.5);
    },

    runSimulation: () => {
        const { inputs } = get();
        const { data, results } = calculateSimulation(inputs);
        set({ simulationData: data, results });
    },
}));
