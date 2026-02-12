'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Sky, OrbitControls, Stars, Text, Html } from '@react-three/drei';
import { useSimulationStore } from '@/lib/store';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Maximize2, Minimize2, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';

// Device Component
const CDTHDevice = ({ timeOfDay }: { timeOfDay: number }) => {
    // Active during day roughly 6-21. Peak heat at 14.
    const tempFactor = (Math.sin(((timeOfDay - 9) * Math.PI) / 12) + 1) / 2;

    const color = useMemo(() => {
        return new THREE.Color().lerpColors(
            new THREE.Color('#295289'), // Blue (Cold)
            new THREE.Color('#ef4444'), // Red (Hot)
            Math.max(0, Math.sin(((timeOfDay - 6) * Math.PI) / 15))
        );
    }, [timeOfDay]);

    return (
        <group position={[0, 0.2, 0]}>
            {/* Main Plate */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[4, 0.2, 4]} />
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
            </mesh>

            {/* Label */}
            <Html position={[0, 1.5, 0]} center>
                <div className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm whitespace-nowrap">
                    CDTH Module
                </div>
            </Html>
        </group>
    );
};

// Heat Haze Particles (Simple version)
const HeatHaze = ({ timeOfDay }: { timeOfDay: number }) => {
    const isDay = timeOfDay > 6 && timeOfDay < 18;
    const mesh = useRef<THREE.InstancedMesh>(null);

    useFrame((state) => {
        if (!mesh.current || !isDay) return;
        const time = state.clock.getElapsedTime();
        // Animate opacity or position slightly
        mesh.current.position.y = 0.5 + Math.sin(time) * 0.1;
    });

    if (!isDay) return null;

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, 20]} position={[0, 1, 0]}>
            <dodecahedronGeometry args={[0.05, 0]} />
            <meshBasicMaterial color="#f2c711" transparent opacity={0.3} />
        </instancedMesh>
    );
};

export default function BeachScene() {
    const { timeOfDay } = useSimulationStore();
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Sun Position: 0-24h mapped to 0-2PI
    const sunPosition = useMemo(() => {
        const angle = ((timeOfDay - 6) / 24) * Math.PI * 2; // Map 6am to 0 rad
        const r = 100;
        return new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r, 0);
    }, [timeOfDay]);

    // Light intensity based on sun height
    const lightIntensity = useMemo(() => {
        if (timeOfDay < 5 || timeOfDay > 19) return 0.1;
        if (timeOfDay < 6 || timeOfDay > 18) return 0.5;
        return 1.5;
    }, [timeOfDay]);

    return (
        <div className={clsx(
            "relative bg-slate-900 border border-slate-700 transition-all duration-300",
            isFullscreen
                ? "fixed inset-0 z-[9999] w-screen h-screen rounded-none m-0"
                : "h-full w-full rounded-2xl overflow-hidden"
        )}>
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-mono flex items-center gap-2 border border-white/10">
                    {timeOfDay > 6 && timeOfDay < 18 ? <Sun size={12} className="text-[#f2c711]" /> : <Moon size={12} className="text-slate-300" />}
                    {Math.floor(timeOfDay).toString().padStart(2, '0')}:{(Math.floor((timeOfDay % 1) * 60)).toString().padStart(2, '0')}
                </div>
                <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 bg-black/60 text-white rounded-full hover:bg-[#f2c711] hover:text-black transition-colors"
                >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
            </div>

            <Canvas shadows camera={{ position: [8, 5, 8], fov: 45 }}>
                {/* Dynamic Lighting */}
                <ambientLight intensity={lightIntensity * 0.3} />
                <directionalLight
                    position={[sunPosition.x, Math.max(sunPosition.y, 10), sunPosition.z]}
                    intensity={lightIntensity}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                />
                <Sky sunPosition={sunPosition} turbidity={8} rayleigh={6} mieCoefficient={0.005} mieDirectionalG={0.8} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* Ocean - Lighter Blue #4fc3f7 */}
                <group position={[0, -1, 0]}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                        <planeGeometry args={[100, 100]} />
                        <meshStandardMaterial color="#4fc3f7" roughness={0.2} metalness={0.1} />
                    </mesh>

                    {/* Sand - Lighter #E6C288 */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                        <circleGeometry args={[15, 64]} />
                        <meshStandardMaterial color="#E6C288" roughness={1} />
                    </mesh>
                </group>

                <group position={[0, -0.1, 0]}>
                    <CDTHDevice timeOfDay={timeOfDay} />
                </group>
                <HeatHaze timeOfDay={timeOfDay} />

                <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} />
                {/* Grid Removed */}
            </Canvas>
        </div>
    );
}
