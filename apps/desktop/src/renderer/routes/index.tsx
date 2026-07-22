import React, { useState } from "react";
import { ApplicationShell } from "../layouts/application-shell";
import { TimelineContainer } from "../features/timeline";

export const WorkspaceRoute: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [projects, setProjects] = useState([
    { id: "proj-1", title: "The Roman Empire - Rise & Fall", type: "Documentary", status: "Scripting", updated: "Just now" },
    { id: "proj-2", title: "Secrets of Quantum Computing", type: "Explainer", status: "Images", updated: "2 hours ago" },
  ]);

  const handleCreateProject = () => {
    const newProj = {
      id: `proj-${projects.length + 1}`,
      title: `Untitled Documentary ${projects.length + 1}`,
      type: "Documentary",
      status: "Draft",
      updated: "Just now"
    };
    setProjects([newProj, ...projects]);
  };

  return (
    <ApplicationShell
      toolbar={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontWeight: 700, fontSize: "15px", color: "#6366f1", letterSpacing: "0.5px" }}>🎬 AI DOCUMENTARY STUDIO</span>
            <span style={{ fontSize: "12px", padding: "2px 8px", backgroundColor: "#334155", borderRadius: "12px", color: "#cbd5e1" }}>Desktop Client</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button 
              onClick={handleCreateProject}
              style={{ backgroundColor: "#6366f1", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
            >
              + New Project
            </button>
            <button style={{ backgroundColor: "#334155", color: "#f8fafc", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>
              ▶ Preview
            </button>
            <button style={{ backgroundColor: "#059669", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              ⬇ Export Video
            </button>
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
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>Project Dashboard</h1>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>AI-Powered Documentary Production Engine</p>
          </div>

          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "8px", border: "1px solid #334155" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>Total Projects</div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#f8fafc", marginTop: "4px" }}>{projects.length}</div>
            </div>
            <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "8px", border: "1px solid #334155" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>Scripts Generated</div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#6366f1", marginTop: "4px" }}>1</div>
            </div>
            <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "8px", border: "1px solid #334155" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>Videos Rendered</div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#10b981", marginTop: "4px" }}>0</div>
            </div>
          </div>

          {/* Workflow Steps */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#cbd5e1", marginBottom: "12px" }}>Production Workflow</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {[
                { title: "1. Script Engine", desc: "Generate multi-scene documentary script from idea" },
                { title: "2. Prompt Pack", desc: "Formulate image prompts per scene" },
                { title: "3. Image Generation", desc: "Upload and generate visual clips" },
                { title: "4. Voiceover", desc: "Synthesize hybrid TTS narration" },
                { title: "5. Timeline", desc: "Synchronize clips, audio, and subtitles" },
                { title: "6. Render Export", desc: "Compile MP4 documentary video" },
              ].map(step => (
                <div key={step.title} style={{ backgroundColor: "#1e293b", padding: "14px", borderRadius: "8px", border: "1px solid #334155" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#6366f1" }}>{step.title}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#cbd5e1", marginBottom: "12px" }}>Recent Projects</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {projects.map(proj => (
                <div key={proj.id} style={{ backgroundColor: "#1e293b", padding: "12px 16px", borderRadius: "8px", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#f8fafc" }}>{proj.title}</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Type: {proj.type} • Status: {proj.status}</div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>{proj.updated}</div>
                </div>
              ))}
            </div>
          </div>
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
