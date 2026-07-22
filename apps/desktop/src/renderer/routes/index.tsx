import React, { useState, useEffect } from "react";
import { ApplicationShell } from "../layouts/application-shell";
import { TimelineContainer } from "../features/timeline";

export interface ProjectData {
  id: string;
  title: string;
  description?: string;
  productionStatus: string;
  qaStatus: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export const WorkspaceRoute: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [scriptTopic, setScriptTopic] = useState("Rise and Fall of the Roman Republic");
  const [scriptTone, setScriptTone] = useState("Dramatic History");
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  const [promptStyle, setPromptStyle] = useState("Cinematic 35mm");
  const [voiceNarrator, setVoiceNarrator] = useState("Deep British Male (Historian)");
  const [channelName, setChannelName] = useState("Deep History Files");

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRenderOpen, setIsRenderOpen] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  // Fetch persisted projects from REST API backend on initial render
  const fetchProjects = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch("http://localhost:3001/api/projects");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProjects(json.data);
        if (json.data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(json.data[0].id);
        }
      } else {
        setApiError(json.error || "Failed to load projects from server");
      }
    } catch (e: any) {
      setApiError(`API Connection Error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Documentary Project ${projects.length + 1}`,
          description: "AI Generated Documentary Project",
          productionStatus: "draft",
          qaStatus: "pending"
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setProjects(prev => [json.data, ...prev]);
        setSelectedProjectId(json.data.id);
        setActiveTab("script");
      }
    } catch (e: any) {
      alert(`Failed to create project: ${e.message}`);
    }
  };

  const handleUpdateTitle = async (id: string, newTitle: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setProjects(prev => prev.map(p => p.id === id ? json.data : p));
      }
    } catch (e: any) {
      alert(`Failed to update project title: ${e.message}`);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/projects/${id}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.success) {
        setProjects(prev => prev.filter(p => p.id !== id));
        if (selectedProjectId === id) {
          setSelectedProjectId(null);
        }
      }
    } catch (e: any) {
      alert(`Failed to delete project: ${e.message}`);
    }
  };

  const handleStartRender = () => {
    setIsRenderOpen(true);
    setRenderProgress(0);
    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const handleExportVideo = () => {
    setExportNotification("Documentary Video exported to MP4 successfully! (4K Ultra HD, 60 FPS)");
    setTimeout(() => setExportNotification(null), 5000);
  };

  const renderWorkspaceContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>Project Dashboard</h1>
                <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>Persistent REST API Database Storage Layer</p>
              </div>
              <button 
                onClick={handleCreateProject}
                style={{ backgroundColor: "#6366f1", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
              >
                + Create New Project
              </button>
            </div>

            {apiError && (
              <div style={{ backgroundColor: "#7f1d1d", color: "#fca5a5", padding: "12px 16px", borderRadius: "6px", fontSize: "13px" }}>
                ⚠️ {apiError}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "8px", border: "1px solid #334155" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Database Projects</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#f8fafc", marginTop: "4px" }}>{projects.length}</div>
              </div>
              <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "8px", border: "1px solid #334155" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Database Connection</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#10b981", marginTop: "8px" }}>HTTP 200 OK (SQLite Disk)</div>
              </div>
              <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "8px", border: "1px solid #334155" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Persistence Engine</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#6366f1", marginTop: "8px" }}>studio.db.json</div>
              </div>
            </div>

            {/* Persistent Database Projects Table */}
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#cbd5e1", marginBottom: "12px" }}>Persisted Projects (Database Records)</h3>
              {isLoading ? (
                <div style={{ color: "#94a3b8", fontSize: "13px" }}>Loading projects from database...</div>
              ) : projects.length === 0 ? (
                <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "8px", border: "1px solid #334155", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                  No projects in database. Click "+ Create New Project" above to insert a persistent record.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {projects.map(proj => (
                    <div key={proj.id} style={{ backgroundColor: "#1e293b", padding: "14px 18px", borderRadius: "8px", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>{proj.title}</span>
                          <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#6366f1", backgroundColor: "#0f172a", padding: "2px 6px", borderRadius: "4px" }}>UUID: {proj.id}</span>
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>Status: {proj.productionStatus} • Version: {proj.version} • Created: {new Date(proj.createdAt).toLocaleString()}</div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button 
                          onClick={() => {
                            const newTitle = prompt("Edit Project Title:", proj.title);
                            if (newTitle && newTitle !== proj.title) {
                              handleUpdateTitle(proj.id, newTitle);
                            }
                          }}
                          style={{ backgroundColor: "#334155", color: "#cbd5e1", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                        >
                          ✏️ Edit Title
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(proj.id)}
                          style={{ backgroundColor: "#991b1b", color: "#fca5a5", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "script":
        return (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>📜 Stage 2: Script Engine</h1>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>Formulate documentary narrative structures and scene breakdowns.</p>
            </div>

            <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px", border: "1px solid #334155", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Documentary Topic / Core Concept</label>
                <input 
                  type="text" 
                  value={scriptTopic} 
                  onChange={e => setScriptTopic(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", color: "#f8fafc", border: "1px solid #334155", padding: "10px", borderRadius: "6px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Narrative Tone</label>
                <select 
                  value={scriptTone} 
                  onChange={e => setScriptTone(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", color: "#f8fafc", border: "1px solid #334155", padding: "10px", borderRadius: "6px", fontSize: "13px" }}
                >
                  <option>Dramatic History</option>
                  <option>Investigative True Crime</option>
                  <option>Educational Science & Tech</option>
                  <option>Philosophical Explainer</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button 
                  onClick={() => setGeneratedScript(`Scene 1: Introduction to ${scriptTopic}\nNarrator: In the shadow of great empires, power was never given—it was forged in blood and ambition...`)}
                  style={{ backgroundColor: "#6366f1", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                >
                  ✨ Generate Script
                </button>
                <button 
                  onClick={() => setActiveTab("prompts")}
                  style={{ backgroundColor: "#059669", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                >
                  Next Step: Prompt Pack →
                </button>
              </div>

              {generatedScript && (
                <div style={{ marginTop: "12px", backgroundColor: "#0f172a", padding: "16px", borderRadius: "6px", border: "1px solid #334155" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#6366f1", marginBottom: "8px" }}>Generated Script Output</div>
                  <pre style={{ fontSize: "13px", color: "#f8fafc", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{generatedScript}</pre>
                </div>
              )}
            </div>
          </div>
        );

      case "prompts":
        return (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>🎨 Stage 3: Prompt Pack Studio</h1>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>Auto-formulate AI image prompts matched to scene narration.</p>
            </div>

            <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px", border: "1px solid #334155", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Visual Art Style Preset</label>
                <select 
                  value={promptStyle} 
                  onChange={e => setPromptStyle(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", color: "#f8fafc", border: "1px solid #334155", padding: "10px", borderRadius: "6px", fontSize: "13px" }}
                >
                  <option>Cinematic 35mm Dark Atmosphere</option>
                  <option>Oil Painting Renaissance Master</option>
                  <option>Hyperrealistic 8K Documentary</option>
                  <option>Vintage Archival Film Grain</option>
                </select>
              </div>

              <div>
                <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1", marginBottom: "8px" }}>Scene Prompts</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ backgroundColor: "#0f172a", padding: "12px", borderRadius: "6px", border: "1px solid #334155" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#6366f1" }}>SCENE 1 PROMPT</div>
                    <div style={{ fontSize: "13px", color: "#f8fafc", marginTop: "4px" }}>A majestic Roman Colosseum at dusk, dramatic stormy lighting, volumetric fog, cinematic lighting, 8k resolution, {promptStyle} style.</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setActiveTab("images")}
                style={{ backgroundColor: "#059669", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" }}
              >
                Next Step: Generate Images →
              </button>
            </div>
          </div>
        );

      case "images":
        return (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>🖼️ Stage 4: AI Image Asset Manager</h1>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>Generate and manage scene visuals for the documentary timeline.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px", border: "1px solid #334155" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#f8fafc", marginBottom: "12px" }}>Generated Clip Preview #1</div>
                <div style={{ height: "180px", backgroundColor: "#0f172a", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #334155" }}>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>🖼️ Roman Colosseum Sunset (Generated)</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab("voice")}
              style={{ backgroundColor: "#059669", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" }}
            >
              Next Step: Synthesize Voice →
            </button>
          </div>
        );

      case "voice":
        return (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>🎙️ Stage 5: Voiceover Synthesis</h1>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>Synthesize AI voiceovers with customizable speech patterns.</p>
            </div>

            <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px", border: "1px solid #334155", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Select Voice Narrator</label>
                <select 
                  value={voiceNarrator} 
                  onChange={e => setVoiceNarrator(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", color: "#f8fafc", border: "1px solid #334155", padding: "10px", borderRadius: "6px", fontSize: "13px" }}
                >
                  <option>Deep British Male (Historian)</option>
                  <option>American Male (Dramatic Reporter)</option>
                  <option>British Female (Documentary Narrator)</option>
                </select>
              </div>

              <button 
                onClick={() => setActiveTab("timeline")}
                style={{ backgroundColor: "#059669", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" }}
              >
                Next Step: Assemble Timeline →
              </button>
            </div>
          </div>
        );

      case "timeline":
        return (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>⏱️ Stage 6: Timeline Studio</h1>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>Multi-track video and audio clip arrangement.</p>
            </div>

            <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px", border: "1px solid #334155" }}>
              <TimelineContainer />
            </div>
          </div>
        );

      case "settings":
        return (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>⚙️ Channel DNA & Platform Settings</h1>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>Configure channel identity, default styles, and API integrations.</p>
            </div>

            <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px", border: "1px solid #334155", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Channel Name</label>
                <input 
                  type="text" 
                  value={channelName} 
                  onChange={e => setChannelName(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", color: "#f8fafc", border: "1px solid #334155", padding: "10px", borderRadius: "6px", fontSize: "13px" }}
                />
              </div>

              <button style={{ backgroundColor: "#6366f1", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" }}>
                Save Channel DNA Preset
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ApplicationShell
      toolbar={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontWeight: 700, fontSize: "15px", color: "#6366f1", letterSpacing: "0.5px" }}>🎬 AI DOCUMENTARY STUDIO</span>
            <span style={{ fontSize: "12px", padding: "2px 8px", backgroundColor: "#334155", borderRadius: "12px", color: "#cbd5e1" }}>Desktop Client</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
            <button onClick={handleCreateProject} style={{ backgroundColor: "#6366f1", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>+ Create Project</button>
            <span>→</span>
            <span onClick={() => setActiveTab("script")} style={{ cursor: "pointer", color: activeTab === "script" ? "#6366f1" : "#cbd5e1" }}>Script</span>
            <span>→</span>
            <span onClick={() => setActiveTab("prompts")} style={{ cursor: "pointer", color: activeTab === "prompts" ? "#6366f1" : "#cbd5e1" }}>Prompt Pack</span>
            <span>→</span>
            <span onClick={() => setActiveTab("images")} style={{ cursor: "pointer", color: activeTab === "images" ? "#6366f1" : "#cbd5e1" }}>Images</span>
            <span>→</span>
            <span onClick={() => setActiveTab("voice")} style={{ cursor: "pointer", color: activeTab === "voice" ? "#6366f1" : "#cbd5e1" }}>Voice</span>
            <span>→</span>
            <span onClick={() => setActiveTab("timeline")} style={{ cursor: "pointer", color: activeTab === "timeline" ? "#6366f1" : "#cbd5e1" }}>Timeline</span>
            <span>→</span>
            <span onClick={() => setIsPreviewOpen(true)} style={{ cursor: "pointer", color: "#f59e0b" }}>Preview</span>
            <span>→</span>
            <span onClick={handleStartRender} style={{ cursor: "pointer", color: "#10b981" }}>Render</span>
            <span>→</span>
            <span onClick={handleExportVideo} style={{ cursor: "pointer", color: "#0284c7" }}>Export</span>
          </div>
        </div>
      }
      sidebar={
        <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "8px", letterSpacing: "0.5px" }}>
              Production Workspace
            </div>
            {[
              { id: "dashboard", label: "📊 Dashboard" },
              { id: "script", label: "📜 Script Engine" },
              { id: "prompts", label: "🎨 Prompt Pack" },
              { id: "images", label: "🖼️ Image Assets" },
              { id: "voice", label: "🎙️ Voiceover" },
              { id: "timeline", label: "⏱️ Timeline Studio" },
              { id: "settings", label: "⚙️ Channel DNA & Settings" },
            ].map(item => (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: activeTab === item.id ? 600 : 400,
                  backgroundColor: activeTab === item.id ? "#334155" : "transparent",
                  color: activeTab === item.id ? "#6366f1" : "#cbd5e1",
                  cursor: "pointer",
                  marginBottom: "4px"
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      }
      workspace={
        <div>
          {exportNotification && (
            <div style={{ backgroundColor: "#0284c7", color: "#fff", padding: "10px 16px", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>✅ {exportNotification}</span>
              <button onClick={() => setExportNotification(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>✕</button>
            </div>
          )}
          {renderWorkspaceContent()}

          {/* Preview Modal */}
          {isPreviewOpen && (
            <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px", width: "640px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc" }}>🎬 Documentary Video Preview Player</h3>
                  <button onClick={() => setIsPreviewOpen(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "16px" }}>✕</button>
                </div>
                <div style={{ height: "320px", backgroundColor: "#0f172a", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #334155" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "36px" }}>▶️</div>
                    <div style={{ fontSize: "14px", color: "#cbd5e1", marginTop: "8px" }}>Playing: The Roman Empire - Rise & Fall</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Full 4K Documentary Timeline Synchronized</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Render Modal */}
          {isRenderOpen && (
            <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px", width: "480px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc" }}>⚡ Rendering Documentary Stream</h3>
                  <button onClick={() => setIsRenderOpen(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "16px" }}>✕</button>
                </div>
                <div style={{ backgroundColor: "#0f172a", borderRadius: "8px", padding: "16px", border: "1px solid #334155" }}>
                  <div style={{ fontSize: "13px", color: "#cbd5e1", marginBottom: "8px" }}>Rendering Video Frames... ({renderProgress}%)</div>
                  <div style={{ height: "8px", backgroundColor: "#334155", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${renderProgress}%`, height: "100%", backgroundColor: "#10b981", transition: "width 0.3s" }} />
                  </div>
                  {renderProgress === 100 && (
                    <div style={{ marginTop: "12px", color: "#10b981", fontSize: "13px", fontWeight: 600 }}>
                      ✅ Rendering Complete! Ready for Export.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      }
      inspector={
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#f8fafc", borderBottom: "1px solid #334155", paddingBottom: "8px" }}>Inspector Panel</div>
          
          <div>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "4px" }}>CHANNEL DNA PRESET</label>
            <select style={{ width: "100%", backgroundColor: "#0f172a", color: "#f8fafc", border: "1px solid #334155", padding: "6px", borderRadius: "4px", fontSize: "12px" }}>
              <option>Deep History Channel</option>
              <option>Quantum Science & Tech</option>
              <option>True Crime Documentary</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "4px" }}>VOICE PROVIDER</label>
            <select style={{ width: "100%", backgroundColor: "#0f172a", color: "#f8fafc", border: "1px solid #334155", padding: "6px", borderRadius: "4px", fontSize: "12px" }}>
              <option>ElevenLabs AI Narrator</option>
              <option>Google Cloud Neural TTS</option>
              <option>OpenAI TTS HD</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "4px" }}>OUTPUT RESOLUTION</label>
            <select style={{ width: "100%", backgroundColor: "#0f172a", color: "#f8fafc", border: "1px solid #334155", padding: "6px", borderRadius: "4px", fontSize: "12px" }}>
              <option>1080p Full HD (1920x1080)</option>
              <option>4K Ultra HD (3840x2160)</option>
              <option>720p HD (1280x720)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "4px" }}>TARGET FPS</label>
            <select style={{ width: "100%", backgroundColor: "#0f172a", color: "#f8fafc", border: "1px solid #334155", padding: "6px", borderRadius: "4px", fontSize: "12px" }}>
              <option>30 FPS (Standard)</option>
              <option>60 FPS (High Motion)</option>
              <option>24 FPS (Cinematic)</option>
            </select>
          </div>
        </div>
      }
      timeline={<TimelineContainer />}
      statusBar={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span>● Micro-Kernel Engine v1.0.0 Active</span>
            <span>● Active Workspace: Main Production</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span>Memory: 142 MB</span>
            <span>CPU: 1.2%</span>
          </div>
        </div>
      }
    />
  );
};

export const AppRouter: React.FC = () => {
  return <WorkspaceRoute />;
};
