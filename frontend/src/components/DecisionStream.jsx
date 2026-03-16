import React, { useState } from 'react';
import { Check, X, Sparkles, User, Calendar, ExternalLink } from 'lucide-react';

function DecisionStream({ projectId, tasks, onRefresh }) {
    const [processing, setProcessing] = useState(false);

    const handleApprove = async (taskId) => {
        setProcessing(true);
        try {
            // Patch task to remove AI draft flag
            await fetch(`https://nexusai-backend-bjcf.onrender.com/api/tasks/${taskId}/approve`, {
                method: 'POST', // We can implement a specific /approve endpoint or use PATCH
            });
            // For now, let's just use a PATCH to change status or flag
            // since I didn't implement /approve in Java yet, I'll update it later or use existing patch
            onRefresh();
        } catch (error) {
            console.error('Failed to approve task:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async (taskId) => {
        try {
            await fetch(`https://nexusai-backend-bjcf.onrender.com/api/tasks/${taskId}`, { method: 'DELETE' });
            onRefresh();
        } catch (error) {
            console.error('Failed to delete draft:', error);
        }
    };

    const getStateStyles = (state) => {
        switch (state?.toUpperCase()) {
            case 'REJECTED':
                return {
                    bg: 'bg-rose-500/10',
                    border: 'border-rose-500/20',
                    text: 'text-rose-500',
                    badge: 'bg-rose-500/20 text-rose-500',
                    label: 'Rejected'
                };
            case 'CONTESTED':
                return {
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/20',
                    text: 'text-amber-500',
                    badge: 'bg-amber-500/20 text-amber-500',
                    label: 'Contested'
                };
            default:
                return {
                    bg: 'bg-emerald-500/10',
                    border: 'border-emerald-500/20',
                    text: 'text-emerald-500',
                    badge: 'bg-emerald-500/20 text-emerald-500',
                    label: 'Agreed'
                };
        }
    };

    if (tasks.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4 opacity-50">
                <div className="p-4 bg-slate-800 rounded-full">
                    <Sparkles className="w-8 h-8" />
                </div>
                <p className="text-sm">Listening to team channels...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {tasks.map((task) => {
                const styles = getStateStyles(task.decisionState);
                return (
                    <div
                        key={task.id}
                        className={`${styles.bg} border ${styles.border} rounded-xl p-4 hover:border-white/20 transition-all group`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${styles.badge}`}>
                                        {styles.label}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-medium">Suggestion</span>
                                </div>
                                <h4 className="font-medium text-slate-100 mb-1 group-hover:text-white transition-colors">{task.title}</h4>
                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">{task.content}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-950/30 rounded-md border border-white/5">
                                        <User className="w-2.5 h-2.5 text-slate-500" />
                                        <span className="text-[9px] text-slate-300">{task.author || "Unknown"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-950/30 rounded-md border border-white/5">
                                        <Calendar className="w-2.5 h-2.5 text-slate-500" />
                                        <span className="text-[9px] text-slate-300">{task.deadline || "TBD"}</span>
                                    </div>
                                    {task.jiraKey && (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 rounded-md border border-blue-500/20">
                                            <ExternalLink className="w-2.5 h-2.5 text-blue-400" />
                                            <span className="text-[9px] text-blue-300 font-bold uppercase tracking-tight">Jira: {task.jiraKey}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {task.decisionState?.toUpperCase() === 'REJECTED' ? (
                                    <button
                                        onClick={() => handleReject(task.id)}
                                        className="p-1.5 bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10"
                                        title="Archive Rejected Proposal"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                ) : task.decisionState?.toUpperCase() === 'CONTESTED' ? (
                                    <>
                                        <button
                                            onClick={() => handleApprove(task.id)}
                                            className="p-1.5 bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-lg hover:bg-amber-500 hover:text-white transition-all"
                                            title="Override & Add to Backlog"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleReject(task.id)}
                                            className="p-1.5 bg-slate-800 text-slate-500 border border-white/5 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                                            title="Dismiss Conflict"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleApprove(task.id)}
                                            className="p-1.5 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                                            title="Approve & Export to Jira"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleReject(task.id)}
                                            className="p-1.5 bg-slate-800 text-slate-500 border border-white/5 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                                            title="Dismiss"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default DecisionStream;
