
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Cpu } from 'lucide-react';
import SectionHeading from './SectionHeading';

const experiences = [
  {
    id: 1,
    role: "Back End Developer",
    company: "Syncasist Business Solutions",
    period: "Aug 2025 - Present",
    location: "Remote",
    description: "Architecting scalable backend microservices and RESTful APIs. Optimizing database queries for high-volume data processing and implementing secure authentication protocols.",
    tech: ["Node.js", "Express", "PostgreSQL", "Redis"],
    color: "cyan"
  },
  {
    id: 2,
    role: "DevOps Intern",
    company: "UptoSkills",
    period: "Feb 2025 - May 2025",
    location: "Remote",
    description: "Assisted in automating deployment pipelines and managing cloud infrastructure. Implemented containerization strategies to improve deployment efficiency across development environments.",
    tech: ["AWS", "Docker", "Jenkins", "Linux"],
    color: "purple"
  }
];

const ExperienceCard: React.FC<{ exp: typeof experiences[0]; index: number }> = ({ exp, index }) => {
    const isEven = index % 2 === 0;

    return (
        <div className={`relative flex items-center justify-between md:justify-normal w-full mb-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
            {/* Timeline Center Line Connection */}
            <div className="absolute left-4 md:left-1/2 w-4 h-4 -translate-x-1/2 bg-slate-100 dark:bg-slate-900 border-2 border-cyan-500 rounded-full z-20 shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-20" />
            </div>
            
            {/* Spacer for desktop layout */}
            <div className="hidden md:block w-1/2" />

            {/* Content Card */}
            <motion.div 
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`w-[calc(100%-40px)] md:w-[calc(50%-40px)] ml-10 md:ml-0 ${isEven ? 'md:mr-10' : 'md:ml-10'} relative group`}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-6 bg-white dark:bg-black/40 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-colors shadow-lg dark:shadow-none">
                    {/* Moving Gradient Border */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">{exp.role}</h3>
                            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-mono text-sm">
                                <Briefcase size={12} />
                                <span>{exp.company}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">
                                <Calendar size={10} />
                                <span>{exp.period}</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                        {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {exp.tech.map((t, i) => (
                            <span key={i} className="px-2 py-0.5 text-[10px] font-mono border border-slate-200 dark:border-white/10 rounded text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-500 hover:border-cyan-500/30 transition-colors cursor-default">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-20 md:py-32 w-full relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
            <SectionHeading 
                title="Mission Timeline"
                subtitle="Operations_Log"
                icon={<Cpu size={14} />}
            />

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent -translate-x-1/2">
                    {/* Running Light Effect */}
                    <motion.div 
                        className="absolute top-0 w-full h-32 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
                        animate={{ top: ["-10%", "110%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                <div className="flex flex-col">
                    {experiences.map((exp, index) => (
                        <ExperienceCard key={exp.id} exp={exp} index={index} />
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
};

export default Experience;
