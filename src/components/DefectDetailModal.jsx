import React from "react";
import { X, MapPin, Building2, Calendar, IndianRupee, ShieldAlert, CheckCircle, Trash2, Camera, Navigation, AlertTriangle } from "lucide-react";

export default function DefectDetailModal({ issue, onClose, onResolve, onDelete, onNavigateMap }) {
  if (!issue) return null;

  const isCritical = issue.severity === "Critical";
  const isResolved = issue.status === "Resolved";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(3, 5, 12, 0.8)",
        backdropFilter: "blur(12px)",
        zIndex: 9000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        animation: "fadeIn 0.25s ease-out"
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "620px",
          background: "rgba(15, 23, 42, 0.95)",
          border: `1px solid ${isCritical ? "rgba(244, 63, 94, 0.5)" : "var(--accent-primary)"}`,
          boxShadow: isCritical ? "0 0 40px rgba(244, 63, 94, 0.3)" : "var(--shadow-lg)",
          padding: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            background: "rgba(0, 0, 0, 0.4)",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--border-radius-sm)",
                background: isCritical ? "rgba(244, 63, 94, 0.2)" : "rgba(245, 158, 11, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isCritical ? "var(--color-danger)" : "var(--color-warning)"
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: "bold", margin: 0, color: "#fff" }}>
                  {issue.category}
                </h3>
                <span className="badge" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", background: "rgba(99,102,241,0.2)", color: "var(--accent-secondary)", border: "1px solid rgba(99,102,241,0.3)" }}>
                  {issue.id}
                </span>
              </div>
              <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                Source: {issue.source}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border-color)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
              cursor: "pointer"
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Image & Key Attributes Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div style={{ position: "relative", borderRadius: "var(--border-radius-sm)", overflow: "hidden", border: "1px solid var(--border-color)", aspectRatio: "16 / 10", background: "#000" }}>
              <img
                src={issue.imageUrl}
                alt={issue.category}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  left: "8px",
                  background: "rgba(0,0,0,0.75)",
                  backdropFilter: "blur(6px)",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
                  fontFamily: "var(--font-mono)",
                  color: "#67e8f9"
                }}
              >
                AI Frame Capture
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--border-color)" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>Status</span>
                <div style={{ marginTop: "4px" }}>
                  <span className={`badge ${isResolved ? "badge-resolved" : isCritical ? "badge-critical" : "badge-moderate"}`}>
                    {issue.status}
                  </span>
                </div>
              </div>

              <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--border-color)" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>Estimated Repair Budget</span>
                <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--color-success)", marginTop: "2px", fontFamily: "var(--font-display)" }}>
                  {issue.estRepairCost || "₹18,500"}
                </div>
              </div>

              <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--border-color)" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>Authority Jurisdiction</span>
                <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#fff", marginTop: "2px" }}>
                  🏛️ {issue.ward || "BBMP Roads Division"}
                </div>
              </div>
            </div>
          </div>

          {/* Description & Location */}
          <div style={{ background: "rgba(0,0,0,0.25)", padding: "1rem", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--border-color)" }}>
            <h4 style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.35rem", textTransform: "uppercase", fontWeight: "700" }}>
              Defect Telemetry Details
            </h4>
            <p style={{ fontSize: "0.9rem", color: "#fff", lineHeight: "1.5" }}>
              {issue.description}
            </p>

            <div style={{ display: "flex", gap: "1rem", marginTop: "0.85rem", fontSize: "0.8rem", color: "var(--text-secondary)", flexWrap: "wrap" }}>
              <span>📍 {issue.address}</span>
              <span>🌐 Lat: {issue.latitude?.toFixed(4)}, Lng: {issue.longitude?.toFixed(4)}</span>
              <span>🕒 {new Date(issue.timestamp).toLocaleString()}</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "1rem 1.5rem",
            background: "rgba(0,0,0,0.4)",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            justify: "space-between",
            alignItems: "center"
          }}
        >
          <button
            className="btn-secondary"
            onClick={() => {
              onDelete(issue.id);
              onClose();
            }}
            style={{ color: "var(--color-danger)", borderColor: "rgba(244,63,94,0.3)", padding: "0.55rem 1rem", fontSize: "0.85rem" }}
          >
            <Trash2 size={15} /> Delete Report
          </button>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              className="btn-secondary"
              onClick={() => {
                onNavigateMap(issue);
                onClose();
              }}
              style={{ padding: "0.55rem 1rem", fontSize: "0.85rem" }}
            >
              <Navigation size={15} /> Locate on Map
            </button>

            {!isResolved && (
              <button
                className="btn-primary"
                onClick={() => {
                  onResolve(issue.id);
                  onClose();
                }}
                style={{ padding: "0.55rem 1.2rem", fontSize: "0.85rem" }}
              >
                <CheckCircle size={16} /> Mark Resolved by Ward
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
