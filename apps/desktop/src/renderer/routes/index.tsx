import React, { useState } from "react";
import { ApplicationShell } from "../layouts/application-shell";
import { TimelineContainer } from "../features/timeline";

export const WorkspaceRoute: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [projects, setProjects] = useState([
    { id: "proj-1", title: "The Roman Empire - Rise & Fall", type: "Documentary", status: "Scripting", updated: "Just now" },
    { id: "proj-2", title: "Secrets of Quantum Computing", type: "Explainer", status: "Images", updated: "2 hours ago" },
  ]);

  const [scriptTopic, setScriptTopic] = useState("Rise and Fall of the Roman Republic");
  const [scriptTone, setScriptTone] = useState("Dramatic History");
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  const [promptStyle, setPromptStyle] = useState("Cinematic 35mm");
  const [voiceNarrator, setVoiceNarrator] = useState("Deep British Male (Historian)");
  const [channelName, setChannelName] = useState("Deep History Files");

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

  const renderWorkspaceContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>Project Dashboard</h1>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>AI-Powered Documentary Production Engine</p>
            </div>

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
        );

      case "script":
        return (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>📜 Script Engine</h1>
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

              <button 
                onClick={() => setGeneratedScript(`Scene 1: Introduction to ${scriptTopic}\nNarrator: In the shadow of great empires, power was never given—it was forged in blood and ambition...`)}
                style={{ backgroundColor: "#6366f1", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" }}
              >
                ✨ Generate Documentary Script
              </button>

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
              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>🎨 Prompt Pack Studio</h1>
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
                  <div style={{ backgroundColor: "#0f172a", padding: "12px", borderRadius: "6px", border: "1px solid #334155" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#6366f1" }}>SCENE 2 PROMPT</div>
                    <div style={{ fontSize: "13px", color: "#f8fafc", marginTop: "4px" }}>Roman senators in heated debate inside the Forum, marble pillars, torchlight illumination, cinematic depth of field, {promptStyle} style.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "images":
        return (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>🖼️ AI Image Asset Manager</h1>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>Generate and manage scene visuals for the documentary timeline.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px", border: "1px solid #334155" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#f8fafc", marginBottom: "12px" }}>Generated Clip Preview #1</div>
                <div style={{ height: "200px", backgroundColor: "#0f172a", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #334155" }}>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>🖼️ Roman Colosseum Sunset (Generated)</span>
                </div>
              </div>
              <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px", border: "1px solid #334155" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#f8fafc", marginBottom: "12px" }}>Generated Clip Preview #2</div>
                <div style={{ height: "200px", backgroundColor: "#0f172a", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #334155" }}>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>🖼️ Senate Forum Gathering (Generated)</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "voice":
        return (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>🎙️ Voiceover Synthesis</h1>
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

              <div style={{ backgroundColor: "#0f172a", padding: "16px", borderRadius: "6px", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#f8fafc" }}>Audio Stream Sample</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Narrator: {voiceNarrator} • Duration: 0:42</div>
                </div>
                <button style={{ backgroundColor: "#6366f1", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                  ▶ Play Narration
                </button>
              </div>
            </div>
          </div>
        );

      case "timeline":
        return (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>⏱️ Timeline Studio</h1>
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
      workspace={renderWorkspaceContent()}
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
