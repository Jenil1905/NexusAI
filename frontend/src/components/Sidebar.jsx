import React from 'react';
import { Folder, Plus, ChevronRight } from 'lucide-react';

function Sidebar({ projects, activeProjectId, setActiveProjectId, onAddProject, health = 75 }) {
    const handleAdd = () => {
        if (onAddProject) {
            onAddProject();
        }
    };

    return (
        <div className="w-64 bg-slate-900 border-r border-white/5 flex flex-col">
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Projects</h3>
                    <button
                        onClick={handleAdd}
                        className="p-1 hover:bg-slate-800 rounded transition-colors"
                        title="Add New Project"
                    >
                        <Plus className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                <nav className="space-y-1">
                    {projects.map(project => (
                        <button
                            key={project.id}
                            onClick={() => setActiveProjectId(project.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${activeProjectId === project.id
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Folder className={`w-4 h-4 ${activeProjectId === project.id ? 'text-primary' : 'text-slate-500 group-hover:text-slate-400'}`} />
                                <span>{project.name}</span>
                            </div>
                            {activeProjectId === project.id && <ChevronRight className="w-4 h-4" />}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-white/5">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                    <p className="text-[10px] font-medium text-slate-500 uppercase mb-2">Workspace Health</p>
                    <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-1000 ease-out"
                            style={{ width: `${health}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{health}% Sync Accuracy</p>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
