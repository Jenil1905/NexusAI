import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DecisionStream from './components/DecisionStream';
import TaskBoard from './components/TaskBoard';
import ProjectModal from './components/ProjectModal';
import Integrations from './components/Integrations';
import LandingPage from './components/LandingPage';
import AskNexusModal from './components/AskNexusModal';
import { Layout, Zap, Brain, ClipboardList, Search } from 'lucide-react';

function Dashboard() {
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('backlog'); // 'backlog' or 'history'
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'integrations'

  // Cmd+K to open Ask Nexus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsAskModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchProjects = () => {
    fetch('http://localhost:8080/api/projects')
      .then(response => response.json())
      .then(data => {
        setProjects(data);
        if (!activeProjectId && data.length > 0) {
          setActiveProjectId(data[0].id);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      });
  };

  const createProject = (name, description) => {
    fetch('http://localhost:8080/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description: description || 'New project created via Nexus AI' })
    })
      .then(response => response.json())
      .then((newProject) => {
        fetchProjects();
        setActiveProjectId(newProject.id);
      })
      .catch(error => console.error('Error creating project:', error));
  };

  const refreshTasks = () => {
    if (activeProjectId) {
      setRefreshing(true);
      fetch(`http://localhost:8080/api/tasks/project/${activeProjectId}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setTasks(data);
          } else {
            console.error('Expected array of tasks, got:', data);
            setTasks([]);
          }
        })
        .catch(error => console.error('Error refreshing tasks:', error))
        .finally(() => setRefreshing(false));
    }
  };

  // Fetch projects on initial load
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch tasks when active project changes
  useEffect(() => {
    refreshTasks();
  }, [activeProjectId]);

  const calculateHealth = () => {
    if (tasks.length === 0) return 100;
    const approved = tasks.filter(t => !t.aiDraft && !t.isAiDraft).length;
    return Math.round((approved / tasks.length) * 100);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50">
      <Sidebar
        projects={projects}
        activeProjectId={activeProjectId}
        setActiveProjectId={setActiveProjectId}
        onAddProject={() => setIsModalOpen(true)}
        health={calculateHealth()}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Zap className="text-primary w-6 h-6 fill-primary" />
            <h1 className="text-xl font-bold tracking-tight">Nexus <span className="text-primary">AI</span></h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAskModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm group"
              title="Ask Nexus (Cmd+K)"
            >
              <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
              <span>Ask Nexus</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-slate-950 rounded text-[10px] font-mono border border-white/5 font-medium ml-2">⌘K</kbd>
            </button>
            <button
              onClick={() => { fetchProjects(); refreshTasks(); }}
              className={`p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all ${refreshing ? 'animate-pulse text-primary' : ''}`}
              title="Refresh Global State"
            >
              <Zap className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex bg-slate-900 rounded-lg p-1 text-sm font-medium">
              <button
                className={`px-4 py-1.5 rounded-md transition-all ${view === 'dashboard' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setView('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={`px-4 py-1.5 rounded-md transition-all ${view === 'integrations' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setView('integrations')}
              >
                Integrations
              </button>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary"></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : view === 'integrations' ? (
            <Integrations />
          ) : (
            <div className="grid grid-cols-12 gap-8 h-full">
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                <section className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col h-full min-h-[500px]">
                  <div className="flex items-center gap-2 mb-6">
                    <Brain className="text-secondary w-5 h-5" />
                    <h2 className="text-lg font-semibold">Decision Feed</h2>
                  </div>
                  <DecisionStream
                    projectId={activeProjectId}
                    tasks={tasks.filter(t => t.aiDraft || t.isAiDraft)}
                    onRefresh={refreshTasks}
                  />
                </section>
              </div>

              <div className="col-span-12 lg:col-span-8">
                <section className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col h-full min-h-[500px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="text-primary w-5 h-5" />
                        <h2 className="text-lg font-semibold">Project Engine</h2>
                      </div>
                      <div className="flex bg-slate-800/50 p-1 rounded-lg">
                        <button
                          onClick={() => setActiveTab('backlog')}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${activeTab === 'backlog' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                          Active Backlog
                        </button>
                        <button
                          onClick={() => setActiveTab('history')}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${activeTab === 'history' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                          History
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={refreshTasks}
                      className={`text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-opacity ${refreshing ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <Zap className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                      {refreshing ? 'Syncing...' : 'Refresh'}
                    </button>
                  </div>
                  <TaskBoard
                    tasks={tasks.filter(t => {
                      const isNotDraft = !t.aiDraft && !t.isAiDraft;
                      if (activeTab === 'backlog') {
                        return isNotDraft && t.status !== 'DONE';
                      } else {
                        return isNotDraft && t.status === 'DONE';
                      }
                    })}
                    onRefresh={refreshTasks}
                    isHistory={activeTab === 'history'}
                  />
                </section>
              </div>
            </div>
          )}
        </div>

        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={createProject}
        />

        <AskNexusModal
          isOpen={isAskModalOpen}
          onClose={() => setIsAskModalOpen(false)}
          projectId={activeProjectId}
        />
      </main>
    </div>
  );
}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
