'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const TeamMember = ({ name, role, major, image, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        viewport={{ once: true }}
        className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 group"
    >
        <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden border-8 border-[#eff6ff] group-hover:border-[#f2c711] transition-colors shadow-lg">
            <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
            />
        </div>
        <h3 className="text-2xl font-bold text-[#295289] mb-1">{name}</h3>
        <p className="text-md font-bold text-[#f2c711] uppercase tracking-wide mb-2">{role}</p>
        <p className="text-slate-500 font-medium">{major}</p>
    </motion.div>
);

export default function TeamPage() {
    const team = [
        {
            name: "Dzaky Zahy Rabbani",
            role: "Ketua Tim",
            major: "Oseanografi ITB",
            image: "/assets/pp_dzaky.jpg"
        },
        {
            name: "Muhammad Ilham Saripul Milah",
            role: "Anggota Tim",
            major: "Teknik Metalurgi ITB",
            image: "/assets/pp_ilham.jpg"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-16 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#295289]/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#f2c711]/10 rounded-full blur-3xl -z-10" />

            <div className="text-center mb-20">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-black text-[#295289] mb-6"
                >
                    Tim Pengembang CDTH
                </motion.h1>
                <div className="w-24 h-2 bg-[#f2c711] mx-auto rounded-full mb-6" />
                <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    Mahasiswa Institut Teknologi Bandung yang terlibat dalam perancangan proposal CDTH dalam rangka pengembangan teknologi energi terbarukan pesisir.
                </p>
            </div>

            {/* Students */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto mb-20">
                {team.map((member, index) => (
                    <TeamMember key={member.name} {...member} delay={index * 0.2} />
                ))}
            </div>

            {/* Advisor */}
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-[#f0f9ff] to-white p-10 rounded-3xl border border-[#cce8f4] flex flex-col md:flex-row items-center gap-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                    <div className="relative w-40 h-40 flex-shrink-0 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:border-[#f2c711] transition-colors duration-300">
                        <Image
                            src="/assets/pp_masImam.jpg"
                            alt="Dosen Pembimbing"
                            fill
                            className="object-cover"
                            style={{ objectPosition: 'top' }}
                        />
                    </div>

                    <div className="text-center md:text-left">
                        <h2 className="text-sm font-bold text-[#f2c711] uppercase tracking-widest mb-2">Dosen Pembimbing</h2>
                        <h3 className="text-3xl font-bold text-[#295289] mb-3">D.Sc.(Tech.) Ir. Imam Santoso, S.T, M.Phil.</h3>
                        <p className="text-slate-700 font-medium text-lg mb-1">Fakultas Teknik Pertambangan dan Perminyakan</p>
                        <p className="text-slate-500">Institut Teknologi Bandung</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
