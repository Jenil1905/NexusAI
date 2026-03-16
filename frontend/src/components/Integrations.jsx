import React from 'react';
import { Slack, MessageSquare, CheckCircle2, Globe, Copy, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

const Integrations = () => {
    const [webhookUrl, setWebhookUrl] = React.useState("https://fb6c68de8567ee.lhr.life/slack/events");

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('URL copied to clipboard!');
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">Integrations</h2>
                <p className="text-slate-400 max-w-2xl">
                    Connect Nexus AI to your favorite tools to capture decisions where they happen.
                    Our autonomous engines listen for consensus and draft tasks for you.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Slack Integration Card */}
                <div className="group relative bg-slate-900/40 border border-white/5 rounded-3xl p-8 hover:bg-slate-900/60 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Slack className="w-24 h-24 text-primary" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <Slack className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Connected</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">Slack Adapter</h3>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            Capture decisions from public channels. The bot listens for mentions and
                            automatically drafts insights into your project backlog.
                        </p>

                        <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5 mb-8">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Webhook URL</span>
                                    <button
                                        onClick={() => copyToClipboard(webhookUrl)}
                                        className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white transition-colors"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={webhookUrl}
                                    onChange={(e) => setWebhookUrl(e.target.value)}
                                    className="bg-transparent text-xs text-primary font-mono outline-none border-b border-white/10 pb-1 focus:border-primary transition-colors w-full"
                                    placeholder="Paste your ngrok/tunnel URL here..."
                                />
                            </div>
                        </div>

                        <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2">
                            Configuration Docs
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Discord Integration Card (Placeholder for Hackathon) */}
                <div className="group relative bg-slate-900/20 border border-dashed border-white/10 rounded-3xl p-8 hover:bg-slate-900/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl opacity-50">
                            <MessageSquare className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Coming Soon</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-300 mb-2 opacity-50">Discord Bridge</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed opacity-50">
                        Connect your Discord server to Nexus. Capture decisions from developer chats
                        and keep your team synced with guild channels.
                    </p>

                    <button disabled className="w-full py-3 bg-white/5 cursor-not-allowed border border-white/5 rounded-xl text-sm font-semibold text-slate-600 transition-all">
                        Join Waitlist
                    </button>
                </div>

                {/* Jira Integration Card (Hackathon Added) */}
                <div className="group relative bg-slate-900/40 border border-white/5 rounded-3xl p-8 hover:bg-slate-900/60 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ExternalLink className="w-24 h-24 text-blue-400" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-3 bg-blue-500/10 rounded-2xl">
                                <Zap className="w-8 h-8 text-blue-400" />
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Active</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">Jira Cloud</h3>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            Auto-export approved AI insights to your Jira backlog.
                            Currently mapped to project: <span className="text-blue-400 font-mono font-bold">NEX</span>
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-950/50 rounded-xl p-3 border border-white/5">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Issue Type</div>
                                <div className="text-xs text-slate-300">Task</div>
                            </div>
                            <div className="bg-slate-950/50 rounded-xl p-3 border border-white/5">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Trigger</div>
                                <div className="text-xs text-slate-300">On Approval</div>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-sm font-semibold text-blue-400 transition-all flex items-center justify-center gap-2">
                            Manage Mapping
                            <CheckCircle2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl">
                    <div className="text-primary font-mono text-2xl font-bold mb-2">10k+</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Events Processed</div>
                </div>
                <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl">
                    <div className="text-secondary font-mono text-2xl font-bold mb-2">98.2%</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Detection Accuracy</div>
                </div>
                <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl">
                    <div className="text-primary font-mono text-2xl font-bold mb-2">&lt;200ms</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Avg. Processing</div>
                </div>
            </div>
        </div>
    );
};

export default Integrations;
