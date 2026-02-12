import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CDTH Digital Twin Simulator',
  description: 'Coastal Delta Thermoelectric Hybrid - Advanced Energy Simulation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, "bg-[#f8fafc] text-slate-800")}>
        <nav className="fixed top-0 w-full z-50 bg-[#295289]/90 backdrop-blur-md text-white shadow-lg h-20 border-b border-white/10">
          <div className="container mx-auto px-4 h-full flex items-center justify-between relative">
            {/* Left: Logos */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
                {[
                  { src: "/assets/Logo_Undiksha.png", alt: "Undiksha" },
                  { src: "/assets/Logo_Aklamasi.png", alt: "Aklamasi" },
                  { src: "/assets/Logo_UKMPKIM.png", alt: "UKM PKIM" },
                  { src: "/assets/Logo_ITB.png", alt: "ITB" }
                ].map((logo, idx) => (
                  <div key={idx} className="relative w-10 h-10 bg-white rounded-full p-1 shadow-md overflow-hidden hover:scale-110 transition-transform duration-300">
                    <Image src={logo.src} alt={logo.alt} fill className="object-contain p-0.5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Center: Title */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center hidden md:block">
              <h1 className="text-4xl font-black tracking-[0.2em] bg-gradient-to-r from-white via-[#f2c711] to-white bg-clip-text text-transparent drop-shadow-lg scale-y-110">
                AKLAMASI 2026
              </h1>
            </div>

            {/* Right: Navigation */}
            <div className="flex gap-8 text-sm font-bold tracking-wide">
              <Link href="/" className="hover:text-[#f2c711] transition-colors uppercase">Home</Link>
              <Link href="/simulation" className="hover:text-[#f2c711] transition-colors uppercase">Simulation</Link>
              <Link href="/documentation" className="hover:text-[#f2c711] transition-colors uppercase">Docs</Link>
              <Link href="/team" className="hover:text-[#f2c711] transition-colors uppercase">Team</Link>
            </div>
          </div>
        </nav>

        <main className="pt-20 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
