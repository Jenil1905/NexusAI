import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, Loader2, Cpu } from 'lucide-react';

const AskNexusModal = ({ isOpen, onClose, projectId }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Scroll to bottom when history changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, loading]);

    // Handle Cmd+K to open (handled in App.jsx, but Esc to close handled here)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim() || !projectId || loading) return;

        const currentQuery = query.trim();
        setQuery('');

        // Add user message to history
        setChatHistory(prev => [...prev, { type: 'user', content: currentQuery }]);
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/projects/${projectId}/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: currentQuery })
            });

            if (!response.ok) throw new Error("Failed to get answer");

            const data = await response.json();

            // Add AI response to history
            setChatHistory(prev => [...prev, { type: 'ai', content: data.answer }]);
        } catch (error) {
            console.error("Ask Nexus Error:", error);
            setChatHistory(prev => [...prev, { type: 'error', content: "I encountered a problem trying to answer that. Please ensure the backend and AI service are running." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-2xl bg-slate-900 border border-white/10 shadow-2xl rounded-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[80vh]"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-slate-950/50">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <span className="text-sm font-semibold text-slate-300">Ask Nexus Oracle</span>
                                <div className="ml-auto flex items-center gap-2">
                                    <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded font-mono font-medium border border-white/5">ESC</kbd>
                                    <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-md text-slate-400 hover:text-white transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Chat History Area (Only visible if there's history) */}
                            {chatHistory.length > 0 && (
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[100px] border-b border-white/5">
                                    {chatHistory.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.type === 'user'
                                                    ? 'bg-primary text-white rounded-br-none'
                                                    : msg.type === 'error'
                                                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-bl-none'
                                                        : 'bg-slate-800 text-slate-200 rounded-bl-none'
                                                }`}>
                                                {msg.type !== 'user' && (
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Cpu className={`w-3 h-3 ${msg.type === 'error' ? 'text-rose-400' : 'text-primary'}`} />
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.type === 'error' ? 'text-rose-400' : 'text-primary'}`}>
                                                            {msg.type === 'error' ? 'System Error' : 'Nexus AI'}
                                                        </span>
                                                    </div>
                                                )}
                                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-3 border border-white/5">
                                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                                <span className="text-slate-400">Consulting project history...</span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}

                            {/* Search Input */}
                            <form onSubmit={handleSubmit} className="p-4 bg-slate-900 flex items-center gap-3 relative">
                                <Search className="w-5 h-5 text-slate-500 absolute left-8" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Ask anything about this project..."
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    disabled={loading || !projectId}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !query.trim() || !projectId}
                                    className="absolute right-6 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Sparkles className="w-4 h-4" />
                                </button>
                            </form>

                            {!projectId && (
                                <div className="px-4 pb-4 text-xs text-rose-400 flex items-center justify-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                    No active project selected.
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AskNexusModal;
