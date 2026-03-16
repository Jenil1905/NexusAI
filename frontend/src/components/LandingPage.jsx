import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Brain, Rocket, Shield, Cpu, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const handleAuth = () => {
        navigate('/dashboard');
    };

    const features = [
        {
            icon: <Brain className="w-8 h-8 text-primary" />,
            title: "Neural Engine",
            description: "Harness the power of our advanced neural network for real-time decision making."
        },
        {
            icon: <Cpu className="w-8 h-8 text-secondary" />,
            title: "Automated Workflows",
            description: "Streamline your projects with AI-driven task orchestration and management."
        },
        {
            icon: <Shield className="w-8 h-8 text-accent" />,
            title: "Secure by Design",
            description: "Enterprise-grade security protocols ensuring your data remains private and protected."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 selection:bg-primary/30 hero-gradient">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between bg-glass rounded-2xl px-6 py-3">
                    <div className="flex items-center gap-2">
                        <Zap className="text-primary w-6 h-6 fill-primary" />
                        <span className="text-xl font-bold tracking-tighter">NEXUS <span className="text-primary text-gradient">AI</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#about" className="hover:text-white transition-colors">About</a>
                        <a href="#nexus" className="hover:text-white transition-colors">Nexus AI</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleAuth}
                            className="px-5 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                        >
                            Log in
                        </button>
                        <button
                            onClick={handleAuth}
                            className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-xl glow-primary hover:scale-105 transition-transform active:scale-95"
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 uppercase tracking-widest"
                    >
                        <Rocket className="w-3 h-3" />
                        <span>The Future of Intelligence is Here</span>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]"
                    >
                        Orchestrate Your <br />
                        <span className="text-gradient">Digital Nexus</span>
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-12"
                    >
                        The next generation AI platform designed to transform complex data into actionable insights and automated workflows. Build, deploy, and scale with Nexus AI.
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button
                            onClick={handleAuth}
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 glow-primary hover:scale-105 transition-all group"
                        >
                            Start Building Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-glass text-white rounded-2xl font-bold hover:bg-white/10 transition-all">
                            Watch Demo
                        </button>
                    </motion.div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-30"></div>
                <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] -z-10 opacity-20"></div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Engineered for Excellence</h2>
                        <p className="text-slate-400">Advanced features to power your next big project</p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="p-8 rounded-3xl bg-glass hover:bg-white/10 transition-all group border-white/5 hover:border-white/20"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* About/Nexus Section */}
            <section id="nexus" className="py-24 px-6 bg-slate-900/40">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-black mb-6">What is <span className="text-gradient">Nexus AI?</span></h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                Nexus AI is a central intelligence hub that integrates seamlessly with your existing stack. We've built an extraction engine specifically designed to pull decisions, tasks, and context from your conversations and documents, turning static noise into dynamic motion.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Real-time decision extraction",
                                    "Deep integration with Jira & Slack",
                                    "Automated task prioritization",
                                    "Predictive project health monitoring"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_#3b82f6]"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                    <div className="flex-1 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl border border-white/10 flex items-center justify-center p-8 overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <div className="relative">
                                <Brain className="w-32 h-32 text-white animate-pulse-slow filter drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
                            </div>

                            {/* Floating tech elements */}
                            <div className="absolute top-10 left-10 p-4 bg-glass rounded-2xl animate-float" style={{ animationDelay: '0s' }}>
                                <Zap className="w-6 h-6 text-primary" />
                            </div>
                            <div className="absolute bottom-10 right-10 p-4 bg-glass rounded-2xl animate-float" style={{ animationDelay: '2s' }}>
                                <Cpu className="w-6 h-6 text-secondary" />
                            </div>
                            <div className="absolute top-1/2 right-4 p-4 bg-glass rounded-2xl animate-float" style={{ animationDelay: '1s' }}>
                                <Shield className="w-6 h-6 text-accent" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer / CTA Section */}
            <footer className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="p-12 md:p-20 rounded-[40px] bg-gradient-to-br from-primary to-secondary relative overflow-hidden text-center">
                        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to step into <br /> the future?</h2>
                            <button
                                onClick={handleAuth}
                                className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl active:scale-95"
                            >
                                Join the Nexus Today
                            </button>
                        </div>
                        {/* Animated background circles */}
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>

                    <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <Zap className="text-primary w-6 h-6 fill-primary" />
                            <span className="text-xl font-bold tracking-tighter text-white">NEXUS AI</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Github className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                            <Twitter className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                            <Linkedin className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                        </div>
                        <p className="text-slate-500 text-sm">© 2026 Nexus AI. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
