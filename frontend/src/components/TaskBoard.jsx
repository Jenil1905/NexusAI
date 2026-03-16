import React, { useState } from 'react';
import { Clock, CheckCircle2, Circle, User, Calendar, MessageSquare, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

function TaskBoard({ tasks, onRefresh, isHistory = false }) {
    const [expandedContext, setExpandedContext] = useState({});
    const [jiraConfig, setJiraConfig] = useState({ url: '', projectKey: '' });

    React.useEffect(() => {
        const fetchJiraConfig = async () => {
            try {
                const response = await fetch('https://nexusai-backend-bjcf.onrender.com/api/tasks/jira-config');
                const data = await response.json();
                setJiraConfig(data);
            } catch (error) {
                console.error('Failed to fetch Jira config:', error);
            }
        };
        fetchJiraConfig();
    }, []);

    const toggleContext = (taskId) => {
        setExpandedContext(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'DONE': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
            case 'IN_PROGRESS': return <Clock className="w-4 h-4 text-amber-400" />;
            default: return <Circle className="w-4 h-4 text-slate-500" />;
        }
    };

    const updateStatus = async (taskId, newStatus) => {
        try {
            await fetch(`https://nexusai-backend-bjcf.onrender.com/api/tasks/${taskId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStatus)
            });
            onRefresh();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (tasks.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-sm text-slate-500">
                    {isHistory
                        ? "No completed tasks yet. Keep pushing!"
                        : "No active tasks. Decisions in the left panel will appear here once approved."}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map(task => (
                <div
                    key={task.id}
                    className="bg-slate-900 border border-white/5 rounded-xl p-5 hover:bg-slate-800 transition-colors group"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${task.status === 'DONE' ? 'bg-emerald-500/10 text-emerald-400' :
                            task.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'
                            }`}>
                            {task.status}
                        </span>
                        {!isHistory && (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => updateStatus(task.id, 'IN_PROGRESS')}
                                    className="p-1 hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Clock className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => updateStatus(task.id, 'DONE')}
                                    className="p-1 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <CheckCircle2 className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>

                    <h4 className="font-medium text-slate-100 mb-2 truncate">{task.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {task.content || "No detailed description provided."}
                    </p>

                    <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md border border-white/5">
                            <User className="w-3 h-3 text-slate-500" />
                            <span className="text-[10px] text-slate-300">{task.author || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md border border-white/5">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span className="text-[10px] text-slate-300">{task.deadline || "TBD"}</span>
                        </div>
                        {task.jiraKey && (
                            <a
                                href={`${jiraConfig.url}/browse/${task.jiraKey}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 rounded-md border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                            >
                                <ExternalLink className="w-3 h-3 text-blue-400" />
                                <span className="text-[10px] text-blue-300 font-bold uppercase tracking-tight">Jira: {task.jiraKey}</span>
                            </a>
                        )}
                    </div>

                    {task.context && (
                        <div className="mb-4">
                            <button
                                onClick={() => toggleContext(task.id)}
                                className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
                            >
                                <MessageSquare className="w-3 h-3" />
                                <span>Original Context</span>
                                {expandedContext[task.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                            {expandedContext[task.id] && (
                                <div className="mt-2 p-3 bg-slate-950/50 rounded-lg border border-white/5 text-[10px] text-slate-400 font-mono leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-top-1 duration-200">
                                    {task.context}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-700"></div>
                            <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-600"></div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {task.id}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TaskBoard;
