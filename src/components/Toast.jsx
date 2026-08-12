import React from "react";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case "danger":
        return <AlertTriangle size={18} style={{ color: "var(--color-danger)" }} />;
      case "success":
        return <CheckCircle size={18} style={{ color: "var(--color-success)" }} />;
      default:
        return <Info size={18} style={{ color: "var(--accent-secondary)" }} />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case "danger":
        return "var(--color-danger)";
      case "success":
        return "var(--color-success)";
      default:
        return "var(--accent-secondary)";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        background: "rgba(13, 17, 36, 0.95)",
        border: `1px solid ${getBorderColor()}`,
        borderRadius: "var(--border-radius-sm)",
        padding: "0.85rem 1.25rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(99, 102, 241, 0.2)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        gap: "0.85rem",
        maxWidth: "420px",
        animation: "fadeIn 0.3s ease-out"
      }}
    >
      <div>{getIcon()}</div>
      <div style={{ flexGrow: 1 }}>
        <div style={{ fontWeight: "700", fontSize: "0.88rem", color: "#fff" }}>
          {toast.title}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px" }}>
          {toast.message}
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          alignItems: "center"
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
