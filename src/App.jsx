import React, { useState, useEffect } from "react";
import { 
  Eye, LayoutDashboard, Camera, Map, ClipboardList, BrainCircuit, Sparkles, 
  Volume2, VolumeX, AlertTriangle, ShieldCheck, Zap, CloudRain, Palette, Hammer, Play
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import AICamera from "./components/AICamera";
import DatasetTrainer from "./components/DatasetTrainer";
import InspectorMap from "./components/InspectorMap";
import ReportsTable from "./components/ReportsTable";
import Toast from "./components/Toast";
import DefectDetailModal from "./components/DefectDetailModal";
import { INITIAL_ISSUES } from "./utils/mockData";
import { soundFx } from "./utils/soundEffects";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedModalIssue, setSelectedModalIssue] = useState(null);

  // Dynamic Theme & Rain Overlay State
  const [theme, setTheme] = useState("obsidian"); // 'obsidian', 'cyan', 'emerald'
  const [rainOverlay, setRainOverlay] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const pendingCount = issues.filter((i) => i.status === "Pending").length;
  const criticalCount = issues.filter((i) => i.severity === "Critical" && i.status !== "Resolved").length;

  const triggerToast = (title, message, type = "info") => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4500);
  };

  const handleTabChange = (tabId) => {
    if (soundEnabled) soundFx.playClick();
    setActiveTab(tabId);
  };

  // Add new issue flagged by AI or manual citizen form
  const handleIssueDetected = (newIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
    if (soundEnabled) soundFx.playAlert(newIssue.severity === "Critical");
    triggerToast(
      `🚨 New Defect Flagged (${newIssue.severity})`,
      `${newIssue.category} reported at ${newIssue.address.split(",")[0]}`,
      newIssue.severity === "Critical" ? "danger" : "info"
    );
  };

  // Mark issue as resolved by authorities
  const handleResolveIssue = (id) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, status: "Resolved" } : issue
      )
    );
    if (soundEnabled) soundFx.playSuccess();
    triggerToast("✓ Hazard Fixed", `Defect #${id} verified and resolved by Ward Engineer!`, "success");
  };

  // Delete report
  const handleDeleteIssue = (id) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== id));
    if (soundEnabled) soundFx.playClick();
    triggerToast("Report Removed", `Defect #${id} was deleted from database.`, "info");
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
    if (next) soundFx.playSuccess();
  };

  // Live Telemetry Simulator Triggers
  const simulateAiHazardSpawn = () => {
    if (soundEnabled) soundFx.playAlert(true);
    const cities = ["bengaluru", "mumbai", "delhi"];
    const randCity = cities[Math.floor(Math.random() * cities.length)];
    const categories = ["Pothole", "Monsoon Waterlogged Pit", "Open Manhole", "Unmarked Speed Breaker"];
    const randCat = categories[Math.floor(Math.random() * categories.length)];

    const newIssue = {
      id: `SIM-${Math.floor(1000 + Math.random() * 9000)}`,
      category: randCat,
      description: `Live simulated AI telemetry flag. Severe road defect spotted by edge dashcam grid.`,
      severity: "Critical",
      status: "Pending",
      source: "Live Telemetry Simulator",
      latitude: 12.9300 + (Math.random() - 0.5) * 0.05,
      longitude: 77.6300 + (Math.random() - 0.5) * 0.05,
      timestamp: new Date().toISOString(),
      city: randCity,
      address: `Outer Ring Rd Junction, ${randCity.toUpperCase()}`,
      ward: `Ward ${Math.floor(10 + Math.random() * 190)}`,
      authority: "BBMP / MCGM Smart Cell",
      estRepairCost: "₹24,500",
      imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop"
    };

    handleIssueDetected(newIssue);
  };

  const simulateWardDispatch = () => {
    const pendingIssues = issues.filter((i) => i.status === "Pending");
    if (pendingIssues.length > 0) {
      const target = pendingIssues[0];
      setIssues((prev) =>
        prev.map((i) => (i.id === target.id ? { ...i, status: "Assigned" } : i))
      );
      if (soundEnabled) soundFx.playSuccess();
      triggerToast("🛠️ Ward Crew Dispatched", `Repair vehicle dispatched to ${target.address.split(",")[0]} (#${target.id})`, "info");
    } else {
      triggerToast("All Clear", "No pending unassigned defects to dispatch.", "info");
    }
  };

  const cycleTheme = () => {
    if (soundEnabled) soundFx.playClick();
    const themes = ["obsidian", "cyan", "emerald"];
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(next);
    triggerToast("🎨 Theme Switch", `Switched design system to ${next.toUpperCase()} mode.`, "info");
  };

  const toggleRainOverlay = () => {
    if (soundEnabled) soundFx.playClick();
    const next = !rainOverlay;
    setRainOverlay(next);
    triggerToast(next ? "🌧️ Monsoon Rain FX ON" : "☀️ Clear Weather FX", next ? "Simulating heavy monsoon road weather conditions." : "Clear weather mode.", "info");
  };

  return (
    <div className="app-container">
      {rainOverlay && <div className="rain-overlay" />}

      {/* Primary Header Navbar */}
      <header className="header">
        <div className="header-logo" onClick={() => handleTabChange("dashboard")}>
          <Eye size={32} style={{ color: "var(--accent-secondary)", filter: "drop-shadow(0 0 10px var(--accent-secondary-glow))" }} />
          <span className="header-title-gradient">
            CivicEye <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", verticalAlign: "middle", letterSpacing: "1px" }}>INDIA</span>
          </span>
        </div>

        {/* Live System Status Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span className="city-selector">
            <Sparkles size={14} className="text-cyan-400" />
            🇮🇳 Smart City AI Grid (BBMP / MCGM / NHAI)
          </span>

          {criticalCount > 0 && (
            <span 
              className="badge badge-critical" 
              style={{ cursor: "pointer", fontSize: "0.75rem" }}
              onClick={() => handleTabChange("reports")}
            >
              {criticalCount} Critical Hazards Active
            </span>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => handleTabChange("dashboard")}
          >
            <LayoutDashboard size={17} />
            Dashboard
          </button>

          <button
            className={`nav-btn ${activeTab === "camera" ? "active" : ""}`}
            onClick={() => handleTabChange("camera")}
          >
            <Camera size={17} />
            Live Footage AI
            <span className="nav-badge" style={{ background: "var(--accent-secondary)" }}>LIVE</span>
          </button>

          <button
            className={`nav-btn ${activeTab === "lab" ? "active" : ""}`}
            onClick={() => handleTabChange("lab")}
          >
            <BrainCircuit size={17} />
            AI Model Lab
          </button>

          <button
            className={`nav-btn ${activeTab === "map" ? "active" : ""}`}
            onClick={() => handleTabChange("map")}
          >
            <Map size={17} />
            Routing Map
          </button>

          <button
            className={`nav-btn ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => handleTabChange("reports")}
          >
            <ClipboardList size={17} />
            Ward Registry
            {pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}
          </button>
        </nav>

        {/* Right Controls */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            className="nav-btn"
            onClick={cycleTheme}
            title="Cycle theme (Obsidian / Cyan / Emerald)"
            style={{ padding: "0.5rem", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)" }}
          >
            <Palette size={17} style={{ color: "var(--accent-secondary)" }} />
          </button>

          <button
            className="nav-btn"
            onClick={toggleRainOverlay}
            title={rainOverlay ? "Turn off monsoon rain FX" : "Turn on monsoon rain FX"}
            style={{ padding: "0.5rem", borderRadius: "50%", background: rainOverlay ? "rgba(6,182,212,0.2)" : "rgba(255, 255, 255, 0.05)" }}
          >
            <CloudRain size={17} style={{ color: rainOverlay ? "var(--accent-secondary)" : "var(--text-muted)" }} />
          </button>

          <button
            className="nav-btn"
            onClick={toggleSound}
            title={soundEnabled ? "Mute audio sound effects" : "Enable sound effects"}
            style={{ padding: "0.5rem", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)" }}
          >
            {soundEnabled ? (
              <Volume2 size={17} style={{ color: "var(--accent-secondary)" }} />
            ) : (
              <VolumeX size={17} style={{ color: "var(--text-muted)" }} />
            )}
          </button>
        </div>
      </header>

      {/* Main Viewport */}
      <main style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {activeTab === "dashboard" && (
          <Dashboard 
            issues={issues} 
            setActiveTab={handleTabChange}
            onSelectIssue={setSelectedModalIssue}
          />
        )}

        {activeTab === "camera" && (
          <AICamera 
            onIssueDetected={handleIssueDetected} 
            activeIssues={issues} 
          />
        )}

        {activeTab === "lab" && (
          <DatasetTrainer />
        )}

        {activeTab === "map" && (
          <InspectorMap
            issues={issues}
            onIssueDetected={handleIssueDetected}
            onResolveIssue={handleResolveIssue}
          />
        )}

        {activeTab === "reports" && (
          <ReportsTable
            issues={issues}
            onIssueDetected={handleIssueDetected}
            onResolveIssue={handleResolveIssue}
            onDeleteIssue={handleDeleteIssue}
            onSelectIssue={setSelectedModalIssue}
          />
        )}
      </main>

      {/* Floating Live Telemetry Simulator Control Dock */}
      <div className="simulator-dock">
        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          ⚡ Live Simulator Dock:
        </span>

        <button className="simulator-btn" onClick={simulateAiHazardSpawn}>
          <Zap size={14} style={{ color: "var(--color-danger)" }} /> Trigger AI Pothole Flag
        </button>

        <button className="simulator-btn" onClick={simulateWardDispatch}>
          <Hammer size={14} style={{ color: "var(--color-warning)" }} /> Dispatch Ward Crew
        </button>

        <button className="simulator-btn" onClick={toggleRainOverlay}>
          <CloudRain size={14} style={{ color: "var(--accent-secondary)" }} /> {rainOverlay ? "Stop Rain" : "Monsoon Rain FX"}
        </button>

        <button className="simulator-btn" onClick={cycleTheme}>
          <Palette size={14} style={{ color: "var(--accent-primary)" }} /> Theme: {theme.toUpperCase()}
        </button>
      </div>

      {/* Global Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Defect Inspection Modal */}
      {selectedModalIssue && (
        <DefectDetailModal
          issue={selectedModalIssue}
          onClose={() => setSelectedModalIssue(null)}
          onResolve={handleResolveIssue}
          onDelete={handleDeleteIssue}
          onNavigateMap={() => handleTabChange("map")}
        />
      )}

      {/* Footer */}
      <footer style={{ 
        textAlign: "center", 
        padding: "1.25rem 0", 
        borderTop: "1px solid var(--border-color)", 
        fontSize: "0.82rem", 
        color: "var(--text-muted)",
        marginTop: "1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          &copy; {new Date().getFullYear()} CivicEye India • Real-World RDD2022 AI Telemetry & Smart Road Avoidance.
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <span>🚀 YOLOv8 Edge Active</span>
          <span>•</span>
          <span>⚡ 30 FPS Telemetry</span>
          <span>•</span>
          <span>🏛️ BBMP & MCGM Integrated</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
