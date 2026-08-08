import React, { useState } from "react";
import { Eye, LayoutDashboard, Camera, Map, ClipboardList, BrainCircuit, Sparkles } from "lucide-react";
import Dashboard from "./components/Dashboard";
import AICamera from "./components/AICamera";
import DatasetTrainer from "./components/DatasetTrainer";
import InspectorMap from "./components/InspectorMap";
import ReportsTable from "./components/ReportsTable";
import { INITIAL_ISSUES } from "./utils/mockData";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [issues, setIssues] = useState(INITIAL_ISSUES);

  // Add new issue flagged by AI or manual citizen form
  const handleIssueDetected = (newIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
  };

  // Mark issue as resolved by authorities
  const handleResolveIssue = (id) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, status: "Resolved" } : issue
      )
    );
  };

  // Delete report
  const handleDeleteIssue = (id) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== id));
  };

  return (
    <div className="app-container">
      {/* Primary Header Navbar */}
      <header className="header">
        <div className="header-logo">
          <Eye size={30} style={{ color: "var(--accent-secondary)" }} />
          <span className="header-title-gradient">CivicEye <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "500", verticalAlign: "middle" }}>India</span></span>
        </div>

        {/* India Flag & Smart City Pill */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="city-selector">
            <Sparkles size={14} className="text-cyan-400" />
            🇮🇳 Indian Smart City AI Grid
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard size={17} />
            Dashboard
          </button>

          <button
            className={`nav-btn ${activeTab === "camera" ? "active" : ""}`}
            onClick={() => setActiveTab("camera")}
          >
            <Camera size={17} />
            Live Footage AI
          </button>

          <button
            className={`nav-btn ${activeTab === "lab" ? "active" : ""}`}
            onClick={() => setActiveTab("lab")}
          >
            <BrainCircuit size={17} />
            AI Model Lab
          </button>

          <button
            className={`nav-btn ${activeTab === "map" ? "active" : ""}`}
            onClick={() => setActiveTab("map")}
          >
            <Map size={17} />
            Routing Map
          </button>

          <button
            className={`nav-btn ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <ClipboardList size={17} />
            Ward Registry
          </button>
        </nav>
      </header>

      {/* Main Viewport */}
      <main style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {activeTab === "dashboard" && (
          <Dashboard issues={issues} setActiveTab={setActiveTab} />
        )}

        {activeTab === "camera" && (
          <AICamera onIssueDetected={handleIssueDetected} activeIssues={issues} />
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
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ 
        textAlign: "center", 
        padding: "1.25rem 0", 
        borderTop: "1px solid var(--border-color)", 
        fontSize: "0.82rem", 
        color: "var(--text-muted)",
        marginTop: "1.5rem"
      }}>
        &copy; {new Date().getFullYear()} CivicEye India • Real-World RDD2022 AI Telemetry & Smart Road Avoidance. Powered by BBMP, MCGM & NHAI Smart City Network.
      </footer>
    </div>
  );
}

export default App;
