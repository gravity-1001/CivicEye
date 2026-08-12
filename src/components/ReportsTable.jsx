import React, { useState } from "react";
import { Search, Filter, Trash2, CheckCircle, PlusCircle, AlertCircle, Download, ClipboardList, Eye, FileJson } from "lucide-react";
import { soundFx } from "../utils/soundEffects";

export default function ReportsTable({ issues, onIssueDetected, onResolveIssue, onDeleteIssue, onSelectIssue }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [formDesc, setFormDesc] = useState("");
  const [formSeverity, setFormSeverity] = useState("Critical");
  const [formAddress, setFormAddress] = useState("");
  const [formCategory, setFormCategory] = useState("Pothole");
  const [showForm, setShowForm] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formDesc || !formAddress) return;

    const lat = 12.9250 + (Math.random() - 0.5) * 0.04;
    const lng = 77.6350 + (Math.random() - 0.5) * 0.04;

    const newIssue = {
      id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
      category: formCategory,
      description: formDesc,
      severity: formSeverity,
      status: "Pending",
      source: "Citizen Web Portal",
      latitude: lat,
      longitude: lng,
      timestamp: new Date().toISOString(),
      address: formAddress,
      ward: "BBMP Citizen Division",
      authority: "BBMP Roads Dept",
      estRepairCost: formSeverity === "Critical" ? "₹18,000" : "₹7,500",
      imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop"
    };

    onIssueDetected(newIssue);
    setFormDesc("");
    setFormAddress("");
    setShowForm(false);
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = 
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.ward && issue.ward.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesSeverity = severityFilter === "All" || issue.severity === severityFilter;
    const matchesStatus = statusFilter === "All" || issue.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const exportCSV = () => {
    soundFx.playClick();
    const headers = ["ID", "Category", "Severity", "Status", "Address", "Ward", "Est Cost"];
    const rows = filteredIssues.map((i) => [
      i.id, i.category, i.severity, i.status, `"${i.address}"`, `"${i.ward || 'BBMP'}"`, i.estRepairCost || "₹15,000"
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "civiceye_india_defect_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    soundFx.playClick();
    const jsonStr = JSON.stringify(filteredIssues, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "civiceye_india_defect_report.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: showForm ? "1fr 340px" : "1fr", gap: '1.5rem' }}>
        
        {/* Left Side: Database list */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: "bold", fontSize: "1.25rem", margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ClipboardList size={22} style={{ color: 'var(--accent-secondary)' }} />
                Indian Municipal Road Defects Registry
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                Inspect, escalate, and export AI-flagged road damage for BBMP, MCGM, and NHAI ward officers.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-secondary" onClick={exportCSV} style={{ fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}>
                <Download size={14} /> Export CSV
              </button>
              <button className="btn-secondary" onClick={exportJSON} style={{ fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}>
                <FileJson size={14} /> Export JSON
              </button>

              {!showForm && (
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setShowForm(true);
                    soundFx.playClick();
                  }}
                  style={{ fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
                >
                  <PlusCircle size={14} /> Flag Defect
                </button>
              )}
            </div>
          </div>

          {/* Filtering bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flexGrow: 1, minWidth: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search by Ward, ID, street address..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={14} style={{ color: 'var(--text-secondary)' }} />
              <select 
                className="form-input" 
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
              >
                <option value="All">All Severities</option>
                <option value="Critical">🔴 Critical Only</option>
                <option value="Moderate">🟡 Moderate Only</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select 
                className="form-input" 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Assigned">Ward Assigned</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Data Table Grid */}
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Defect Info</th>
                  <th>Ward / Authority</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Est. Cost</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => {
                  const isCritical = issue.severity === "Critical";
                  const isResolved = issue.status === "Resolved";
                  
                  return (
                    <tr key={issue.id} style={{ cursor: "pointer" }} onClick={() => onSelectIssue && onSelectIssue(issue)}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '0.82rem', color: 'var(--accent-secondary)' }}>
                        {issue.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: '#fff' }}>{issue.category}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={issue.description}>
                          {issue.address}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {issue.ward || "BBMP Ward 150"}
                      </td>
                      <td>
                        <span className={`badge ${isCritical ? 'badge-critical' : 'badge-moderate'}`}>
                          {issue.severity}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isResolved ? 'badge-resolved' : 'badge-critical'}`}>
                          {issue.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-success)' }}>
                        {issue.estRepairCost || "₹15,000"}
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button 
                            className="nav-btn" 
                            onClick={() => onSelectIssue && onSelectIssue(issue)}
                            title="Inspect Telemetry Details"
                            style={{ padding: '0.35rem', borderRadius: '4px', background: 'rgba(6,182,212,0.15)', color: 'var(--accent-secondary)' }}
                          >
                            <Eye size={14} />
                          </button>
                          {!isResolved && (
                            <button 
                              className="nav-btn" 
                              onClick={() => onResolveIssue(issue.id)}
                              title="Mark Fixed by Ward Engineer"
                              style={{ padding: '0.35rem', borderRadius: '4px', background: 'rgba(16,185,129,0.15)', color: 'var(--color-success)' }}
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                          <button 
                            className="nav-btn" 
                            onClick={() => onDeleteIssue(issue.id)}
                            title="Delete Report"
                            style={{ padding: '0.35rem', borderRadius: '4px', background: 'rgba(255,51,102,0.15)', color: 'var(--color-danger)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Manual Form */}
        {showForm && (
          <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: "bold", fontSize: "1.1rem", margin: 0 }}>
              Flag Road Defect (Citizen Portal)
            </h3>
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Defect Type</label>
                <select className="form-input" value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                  <option value="Pothole">Pothole</option>
                  <option value="Unmarked Speed Breaker">Unmarked Speed Breaker</option>
                  <option value="Monsoon Waterlogged Pit">Monsoon Waterlogged Pit</option>
                  <option value="Open Manhole">Open Manhole</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Location / Address</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., 100ft Road, Indiranagar, Bengaluru" 
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Description</label>
                <textarea 
                  className="form-input" 
                  rows="3"
                  placeholder="Detail defect to alert BBMP/MCGM ward..." 
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flexGrow: 1 }}>Submit Flag</button>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
