import { SimulationInputs, SimulationDataPoint, SimulationResults } from '../store';

export const calculateSimulation = (inputs: any): { data: SimulationDataPoint[], results: SimulationResults } => {
    const data: SimulationDataPoint[] = [];
    let totalPower = 0; // Cumulative Power in mW
    let totalEfficiency = 0;

    // Constants
    const R_internal = 2.0; // Ohms (Internal Resistance of TEG)
    const R_load = 2.0; // Ohms (Load Resistance for max power matches internal)
    const DeviceArea = 0.04; // m^2 (assumed 20cm x 20cm module)

    for (let t = 0; t <= 24; t += 1) {
        // 1. Calculate Temperatures (Sinusoidal Models)
        // Sand Peak at 14:00
        let tempSand = (inputs.sandTempPeak - 15) + 15 * Math.sin(((t - 14) * Math.PI) / 12);

        // Air Peak at 15:00, base 28C, amplitude 5C
        let tempAir = 28 + 5 * Math.sin(((t - 15) * Math.PI) / 12);

        // Apply Location effects
        if (inputs.location === 'Tanah Lot') {
            // Windy location: Night time air cools down faster
            if (t < 6 || t > 18) {
                tempAir -= 2;
            }
        }

        // Clamp temperatures to realistic minimums
        if (tempSand < 20) tempSand = 20;
        if (tempAir < 20) tempAir = 20;

        // 2. Electrical Calculations
        const deltaT = tempSand - tempAir;

        // Seebeck Effect: V = S * dT
        // Use absolute deltaT because TEG generates power regardless of direction (simplified)
        // but typically we care about Sand > Air. If Sand < Air (night), voltage is negative implies reverse polarity.
        const voltage = Math.abs(inputs.seebeckCoefficient * deltaT); // Volts

        // Power P = V^2 / R
        // Total R = R_internal + R_load
        const current = voltage / (R_internal + R_load);
        const powerW = Math.pow(current, 2) * R_load; // Watts
        const powerMW = powerW * 1000; // mW

        // Efficiency (Idealized Carnot * Device ZT factor approximation or just simple ratio)
        // Simple approx: Power Output / Heat Input (Input ~ K * dT)
        // Let's simplified efficiency metric for display
        const efficiency = deltaT !== 0 ? (powerW / (inputs.conductivity * DeviceArea * Math.abs(deltaT))) * 100 : 0;

        data.push({
            time: t,
            tempSand: parseFloat(tempSand.toFixed(1)),
            tempAir: parseFloat(tempAir.toFixed(1)),
            voltage: parseFloat((voltage * 1000).toFixed(1)), // mV
            power: parseFloat(powerMW.toFixed(1)), // mW
        });

        totalPower += powerMW;
        totalEfficiency += efficiency;
    }

    // 3. Aggregate Results
    // Single Module Energy
    const singleModuleEnergyWh = (totalPower / 1000) * 1;

    // System Energy (Scaled by Module Count)
    const totalEnergyWh = singleModuleEnergyWh * inputs.moduleCount;

    // Economics
    const electricityRate = 1444; // Rp/kWh
    const annualEnergyWh = totalEnergyWh * 365; // Annual System Energy
    const totalSavings = (totalEnergyWh / 1000) * electricityRate; // Daily Savings (System)

    // LCOE = Total Lifetime Cost / Total Lifetime Energy
    const lifetimeEnergykWh = (annualEnergyWh / 1000) * inputs.lifetime;
    const lcoe = lifetimeEnergykWh > 0 ? inputs.systemCost / lifetimeEnergykWh : 0;

    // ROI = Cost / Annual Savings
    const annualSavings = (annualEnergyWh / 1000) * electricityRate;
    const roi = annualSavings > 0 ? inputs.systemCost / annualSavings : 0;

    const avgEfficiency = totalEfficiency / 25;

    return {
        data,
        results: {
            totalEnergy: parseFloat(totalEnergyWh.toFixed(2)),
            averageEfficiency: parseFloat(avgEfficiency.toFixed(2)),
            totalSavings: parseFloat(totalSavings.toFixed(2)),
            lcoe: parseFloat(lcoe.toFixed(0)),
            roi: parseFloat(roi.toFixed(1))
        }
    };
};
