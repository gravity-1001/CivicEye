import React from "react";
import { AlertTriangle, Hammer, CheckCircle, Activity, TrendingUp, IndianRupee, ClipboardList, ShieldAlert, Sparkles, ArrowUpRight, Zap, MapPin, Eye } from "lucide-react";

export default function Dashboard({ issues, setActiveTab, onSelectIssue }) {
  const totalReports = issues.length;
  const activePending = issues.filter((i) => i.status === "Pending").length;
  const dispatched = issues.filter((i) => i.status === "Assigned").length;
  const resolved = issues.filter((i) => i.status === "Resolved").length;

  const categoriesCount = issues.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(categoriesCount).map((name) => ({
    name,
    count: categoriesCount[name]
  }));

  const maxBarCount = Math.max(...categories.map((c) => c.count), 1);

  const latestIssues = [...issues]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Quick Hero Banner */}
      <div
        className="glass-card"
        style={{
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(6, 182, 212, 0.12) 60%, rgba(13, 19, 38, 0.9) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.35)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 2rem",
          boxShadow: "0 10px 40px rgba(99, 102, 241, 0.15)"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <span className="badge badge-info" style={{ fontSize: "0.72rem" }}>
              <Zap size={13} /> Real-Time On-Device Telemetry Active
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Updated 2s ago
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: "800", color: "#fff", margin: 0 }}>
            Indian Smart City Road Hazard Grid
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.25rem", maxWidth: "750px" }}>
            Automated detection & pothole avoidance powered by RDD2022 trained edge models across BBMP (Bengaluru), MCGM (Mumbai), and NHAI Expressways.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.85rem" }}>
          <button 
            className="btn-primary" 
            onClick={() => setActiveTab("camera")}
            style={{ padding: "0.75rem 1.4rem", fontSize: "0.88rem" }}
          >
            <Eye size={18} /> Launch AI Camera Stream
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => setActiveTab("map")}
            style={{ padding: "0.75rem 1.2rem", fontSize: "0.88rem" }}
          >
            <MapPin size={18} /> Open Routing Map
          </button>
        </div>
      </div>

      {/* 1. KPIs Grid */}
      <div className="dashboard-grid">
        <div className="glass-card kpi-card">
          <div className="kpi-icon" style={{ background: "rgba(99, 102, 241, 0.15)", color: "var(--accent-primary)" }}>
            <ClipboardList size={26} />
          </div>
          <div className="kpi-info" style={{ flexGrow: 1 }}>
            <h3>Total Flags</h3>
            <p>{totalReports}</p>
            <div className="kpi-trend" style={{ color: "var(--accent-secondary)" }}>
              <ArrowUpRight size={13} /> +18.4% this month
            </div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon" style={{ background: "rgba(255, 51, 102, 0.15)", color: "var(--color-danger)" }}>
            <AlertTriangle size={26} />
          </div>
          <div className="kpi-info" style={{ flexGrow: 1 }}>
            <h3>Active Pending</h3>
            <p style={{ color: activePending > 0 ? "var(--color-danger)" : "#fff" }}>{activePending}</p>
            <div className="kpi-trend" style={{ color: "var(--color-danger)" }}>
              {activePending} Ward Escalations
            </div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "var(--color-warning)" }}>
            <Hammer size={26} />
          </div>
          <div className="kpi-info" style={{ flexGrow: 1 }}>
            <h3>Crews Dispatched</h3>
            <p>{dispatched}</p>
            <div className="kpi-trend" style={{ color: "var(--color-warning)" }}>
              Avg Response: 4.2 hrs
            </div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--color-success)" }}>
            <IndianRupee size={26} />
          </div>
          <div className="kpi-info" style={{ flexGrow: 1 }}>
            <h3>Est. Repair Savings</h3>
            <p style={{ color: "var(--color-success)" }}>₹4.8 Lakhs</p>
            <div className="kpi-trend" style={{ color: "var(--color-success)" }}>
              Avoided vehicle claim cost
            </div>
          </div>
        </div>
      </div>

      {/* 2. Charts and Main Content Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        
        {/* Left Card: Analytics */}
        <div className="glass-card flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: "bold", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <TrendingUp size={20} style={{ color: 'var(--accent-secondary)' }} />
              Indian Smart City Telemetry Analytics
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              AI detection breakdown across Bengaluru, Mumbai, and Delhi NCR road infrastructure.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div>
              <h4 style={{ fontSize: "0.88rem", color: "#fff", marginBottom: "1rem", fontWeight: "700" }}>Issues by Defect Category</h4>
              <div className="chart-container-visuals">
                {categories.map((c, i) => {
                  const percentHeight = (c.count / maxBarCount) * 100;
                  return (
                    <div key={i} className="chart-bar-col">
                      <div 
                        className="chart-bar-pillar" 
                        style={{ height: `${percentHeight}%` }}
                        data-value={c.count}
                      />
                      <span className="chart-bar-label">{c.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "0.88rem", color: "#fff", marginBottom: "1.5rem", fontWeight: "700" }}>Monsoon Season Defect Trend</h4>
              <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                <svg viewBox="0 0 300 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="glow-grad-in" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.45"/>
                      <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  
                  <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="100" x2="300" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                  <path 
                    d="M 10 90 Q 60 70 110 95 T 210 30 T 290 15 L 290 120 L 10 120 Z" 
                    fill="url(#glow-grad-in)"
                  />

                  <path 
                    d="M 10 90 Q 60 70 110 95 T 210 30 T 290 15" 
                    fill="none" 
                    stroke="var(--accent-secondary)" 
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  <circle cx="10" cy="90" r="4" fill="var(--bg-main)" stroke="var(--accent-secondary)" strokeWidth="2" />
                  <circle cx="110" cy="95" r="4" fill="var(--bg-main)" stroke="var(--accent-secondary)" strokeWidth="2" />
                  <circle cx="210" cy="30" r="4" fill="var(--bg-main)" stroke="var(--accent-secondary)" strokeWidth="2" />
                  <circle cx="290" cy="15" r="5" fill="var(--bg-main)" stroke="var(--color-danger)" strokeWidth="2" />

                  <text x="10" y="112" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">May</text>
                  <text x="66" y="112" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">Jun</text>
                  <text x="122" y="112" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">Jul (Peak Rain)</text>
                  <text x="210" y="112" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">Aug</text>
                  <text x="290" y="112" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">Sep</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Municipal Ward Response Scorecard */}
          <div style={{ background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--border-color)", marginTop: "0.5rem" }}>
            <h4 style={{ fontSize: "0.85rem", fontWeight: "bold", color: "#fff", marginBottom: "0.75rem" }}>
              Municipal Ward Response Index
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>BBMP Bengaluru</span>
                <span style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--color-success)" }}>94.2% Fixed</span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Avg 3.8 hrs</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>MCGM Mumbai</span>
                <span style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--color-warning)" }}>88.5% Fixed</span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Avg 5.1 hrs</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>NHAI Delhi NCR</span>
                <span style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--accent-secondary)" }}>96.0% Fixed</span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Avg 2.4 hrs</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Card: Activity Feed */}
        <div className="glass-card flex flex-col" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '520px' }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: "bold", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Activity size={20} style={{ color: 'var(--accent-secondary)' }} />
              Live Ward Telemetry Stream
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Click any defect to inspect AI bounding box & details.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", overflowY: "auto", paddingRight: "4px" }}>
            {latestIssues.map((issue) => {
              const isCritical = issue.severity === "Critical";
              const isResolved = issue.status === "Resolved";
              
              return (
                <div 
                  key={issue.id} 
                  onClick={() => onSelectIssue && onSelectIssue(issue)}
                  style={{ 
                    background: "rgba(0,0,0,0.35)", 
                    padding: "0.75rem 0.85rem", 
                    borderRadius: "var(--border-radius-sm)", 
                    border: "1px solid " + (isCritical && !isResolved ? "rgba(255,51,102,0.3)" : "var(--border-color)"), 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  className="hover:border-cyan-400"
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "2px" }}>
                      <span className={`badge ${isResolved ? "badge-resolved" : isCritical ? "badge-critical" : "badge-moderate"}`}>{issue.severity}</span>
                      <strong style={{ fontSize: "0.85rem", color: "#fff" }}>{issue.category}</strong>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      📍 {issue.address.split(",")[0]}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      🏛️ {issue.ward || "BBMP Ward"} • {issue.id}
                    </div>
                  </div>
                  
                  <span style={{ fontSize: "0.8rem", color: isResolved ? "var(--color-success)" : "var(--color-danger)", fontWeight: "bold" }}>
                    {issue.status}
                  </span>
                </div>
              );
            })}
          </div>

          <button 
            className="btn-secondary" 
            style={{ width: "100%", fontSize: "0.85rem", padding: "0.6rem", marginTop: "auto" }}
            onClick={() => setActiveTab("reports")}
          >
            Open Complete Ward Registry
          </button>
        </div>
      </div>

    </div>
  );
}
