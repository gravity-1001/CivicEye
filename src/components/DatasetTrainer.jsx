import React, { useState, useEffect } from "react";
import { 
  BrainCircuit, Database, Cpu, Play, Pause, Download, Layers, 
  Sparkles, CheckCircle, Sliders, LineChart, ShieldCheck, FileCode, Tag, SlidersHorizontal, Activity
} from "lucide-react";
import { INDIAN_DATASETS, PRETRAINED_MODELS } from "../utils/mockData";
import { soundFx } from "../utils/soundEffects";

export default function DatasetTrainer() {
  const [selectedDataset, setSelectedDataset] = useState(INDIAN_DATASETS[0]);
  const [selectedArchitecture, setSelectedArchitecture] = useState("yolov8-nano");
  const [epochs, setEpochs] = useState(25);
  const [batchSize, setBatchSize] = useState(16);
  const [learningRate, setLearningRate] = useState("0.001");
  const [enableMonsoonAug, setEnableMonsoonAug] = useState(true);
  const [enableNightAug, setEnableNightAug] = useState(true);
  const [confThreshold, setConfThreshold] = useState(75);

  // Training Simulation State
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentMap, setCurrentMap] = useState(0);
  const [currentLoss, setCurrentLoss] = useState(0.85);
  const [lossHistory, setLossHistory] = useState([0.85]);
  const [trainLogs, setTrainLogs] = useState([
    { time: new Date().toLocaleTimeString(), text: "Dataset trainer initialized. Ready for training job." }
  ]);
  const [isTrained, setIsTrained] = useState(false);

  // Active sample annotation tab
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);

  // Sample annotated frames with bounding box metadata
  const sampleFrames = [
    {
      title: "Bengaluru ORR - Pothole & Unmarked Hump",
      location: "Outer Ring Road, Bellandur, Bengaluru",
      boxes: [
        { label: "Pothole (D40)", conf: 94, x: 28, y: 55, w: 24, h: 22, color: "#ff3366" },
        { label: "Unmarked Hump", conf: 89, x: 58, y: 62, w: 32, h: 18, color: "#f59e0b" }
      ]
    },
    {
      title: "Mumbai WEH Monsoon Rain Defect",
      location: "Western Express Highway, Bandra, Mumbai",
      boxes: [
        { label: "Waterlogged Pit", conf: 91, x: 35, y: 52, w: 38, h: 28, color: "#06b6d4" },
        { label: "Asphalt Erosion", conf: 86, x: 12, y: 68, w: 20, h: 15, color: "#f59e0b" }
      ]
    },
    {
      title: "Delhi NH-48 Gurgaon Expressway",
      location: "Cyber City Flyover, Gurgaon NCR",
      boxes: [
        { label: "Open Manhole", conf: 96, x: 44, y: 60, w: 18, h: 20, color: "#ff3366" }
      ]
    }
  ];

  // Start Training Simulation Loop
  const handleStartTraining = () => {
    setIsTraining(true);
    setIsTrained(false);
    setCurrentEpoch(0);
    setTrainingProgress(0);
    setCurrentMap(35.0);
    setCurrentLoss(0.82);
    setLossHistory([0.82]);
    soundFx.playAlert(false);
    
    addTrainLog(`🚀 Started training ${selectedArchitecture.toUpperCase()} on dataset ${selectedDataset.name}`);
    addTrainLog(`Hyperparameters: Epochs=${epochs}, BatchSize=${batchSize}, LR=${learningRate}, MonsoonAug=${enableMonsoonAug ? "ON" : "OFF"}`);
  };

  const addTrainLog = (text) => {
    const time = new Date().toLocaleTimeString();
    setTrainLogs((prev) => [{ time, text }, ...prev.slice(0, 35)]);
  };

  useEffect(() => {
    let interval = null;
    if (isTraining) {
      interval = setInterval(() => {
        setCurrentEpoch((prevEpoch) => {
          const nextEpoch = prevEpoch + 1;
          const progress = Math.round((nextEpoch / epochs) * 100);
          setTrainingProgress(progress);

          // Calculate synthetic loss reduction and mAP improvement
          const newLoss = Math.max(0.045, +(0.85 * Math.exp(-nextEpoch / (epochs * 0.4))).toFixed(4));
          const newMap = Math.min(88.8, +(35 + (88.8 - 35) * (1 - Math.exp(-nextEpoch / (epochs * 0.35)))).toFixed(1));
          
          setCurrentLoss(newLoss);
          setCurrentMap(newMap);
          setLossHistory((prev) => [...prev, newLoss]);

          addTrainLog(`Epoch [${nextEpoch}/${epochs}] — BoxLoss: ${newLoss} | mAP@50: ${newMap}% | Precision: ${(newMap * 0.95).toFixed(1)}%`);

          if (nextEpoch >= epochs) {
            setIsTraining(false);
            setIsTrained(true);
            soundFx.playSuccess();
            addTrainLog(`✅ Training Completed Successfully! Best mAP@50: ${newMap}%. Weights saved.`);
          }

          return nextEpoch;
        });
      }, 450);
    }
    return () => clearInterval(interval);
  }, [isTraining, epochs, selectedArchitecture, selectedDataset]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div 
        className="glass-card" 
        style={{ 
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(6, 182, 212, 0.12) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.35)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 2rem"
        }}
      >
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: "800", color: "#fff", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <BrainCircuit size={26} style={{ color: "var(--accent-secondary)" }} />
            CivicEye AI Lab — Real-World Dataset & Model Training Studio
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Train custom YOLOv8 / Neural models on 25,000+ real-world Indian road defect frames (RDD2022 India Corpus) for deployment on dashcams & smart city edge hardware.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <span className="badge badge-info" style={{ padding: "0.5rem 1rem", fontSize: "0.82rem" }}>
            <Database size={14} /> 28,450 Bounding Boxes
          </span>
          <span className="badge badge-resolved" style={{ padding: "0.5rem 1rem", fontSize: "0.82rem" }}>
            <ShieldCheck size={14} /> Real Indian Roads
          </span>
        </div>
      </div>

      {/* Main Grid: Dataset Explorer & Trainer Workspace */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        
        {/* Left Card: Real-World Dataset Annotator Gallery */}
        <div className="glass-card flex flex-col gap-4" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: "bold", fontSize: "1.1rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Tag size={18} style={{ color: "var(--accent-primary)" }} />
              Indian Road Defect Dataset Browser
            </h3>
            <select 
              className="form-input" 
              value={selectedDataset.id}
              onChange={(e) => {
                const found = INDIAN_DATASETS.find((d) => d.id === e.target.value);
                if (found) setSelectedDataset(found);
              }}
              style={{ width: "auto", padding: "0.35rem 0.75rem", fontSize: "0.82rem" }}
            >
              {INDIAN_DATASETS.map((ds) => (
                <option key={ds.id} value={ds.id}>{ds.name}</option>
              ))}
            </select>
          </div>

          {/* Dataset Info Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.65rem 0.85rem", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Frame Count:</span>
              <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#fff", marginTop: "2px" }}>{selectedDataset.framesCount.toLocaleString()}</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.65rem 0.85rem", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Total Boxes:</span>
              <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--accent-secondary)", marginTop: "2px" }}>{selectedDataset.annotationsCount.toLocaleString()}</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.65rem 0.85rem", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Baseline mAP@50:</span>
              <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-success)", marginTop: "2px" }}>{selectedDataset.mAP50}</div>
            </div>
          </div>

          {/* Annotated Sample Display Canvas */}
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: "var(--border-radius-sm)", overflow: "hidden", border: "1px solid var(--border-color)", background: "#050814" }}>
            {/* Background Sample Image with Augmentation Filter */}
            <img 
              src={selectedDataset.sampleImg} 
              alt="Indian Road Frame"
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover", 
                opacity: enableNightAug ? 0.65 : 0.85,
                filter: enableMonsoonAug ? "contrast(1.15) saturate(0.9) brightness(0.85)" : "none"
              }} 
            />

            {/* Bounding Box Annotations Overlays */}
            {sampleFrames[activeSampleIndex].boxes.map((box, idx) => {
              if (box.conf < confThreshold) return null;
              return (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.w}%`,
                    height: `${box.h}%`,
                    border: `2px solid ${box.color}`,
                    boxShadow: `0 0 12px ${box.color}80`,
                    borderRadius: "3px",
                    pointerEvents: "none"
                  }}
                >
                  <span 
                    style={{ 
                      position: "absolute", 
                      top: "-22px", 
                      left: "-2px", 
                      background: box.color, 
                      color: "#fff", 
                      fontSize: "10px", 
                      fontWeight: "bold", 
                      padding: "2px 6px", 
                      borderRadius: "2px",
                      fontFamily: "var(--font-mono)",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {box.label} ({box.conf}%)
                  </span>
                </div>
              );
            })}

            {/* Sample Selector Pill Overlay */}
            <div style={{ position: "absolute", bottom: "10px", left: "10px", right: "10px", display: "flex", gap: "0.5rem", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", padding: "6px 12px", borderRadius: "99px" }}>
              {sampleFrames.map((frame, i) => (
                <button
                  key={i}
                  className="nav-btn"
                  onClick={() => setActiveSampleIndex(i)}
                  style={{
                    padding: "3px 10px",
                    fontSize: "11px",
                    background: activeSampleIndex === i ? "var(--accent-primary)" : "transparent",
                    color: activeSampleIndex === i ? "#fff" : "var(--text-secondary)"
                  }}
                >
                  Frame #{i + 1}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
              Confidence Filter: {confThreshold}%
            </span>
            <input 
              type="range" 
              min="50" 
              max="95" 
              value={confThreshold} 
              onChange={(e) => setConfThreshold(parseInt(e.target.value))}
              style={{ flexGrow: 1, accentColor: "var(--accent-secondary)" }}
            />
          </div>
        </div>

        {/* Right Card: Custom Model Training Suite */}
        <div className="glass-card flex flex-col gap-4" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: "bold", fontSize: "1.1rem", margin: 0, borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sliders size={18} style={{ color: "var(--accent-secondary)" }} />
            Model Hyperparameter Configuration
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                Architecture Backbone
              </label>
              <select 
                className="form-input" 
                value={selectedArchitecture} 
                onChange={(e) => setSelectedArchitecture(e.target.value)}
                disabled={isTraining}
                style={{ fontSize: "0.85rem", padding: "0.45rem" }}
              >
                <option value="yolov8-nano">YOLOv8 Nano (2.8MB - Edge Mobile)</option>
                <option value="yolov8-medium">YOLOv8 Medium (18.4MB - High Precision)</option>
                <option value="efficientdet">EfficientDet-Lite-IN (6.1MB)</option>
                <option value="mobilenet">MobileNetV3-SSD (3.5MB)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                Target Training Epochs
              </label>
              <input 
                type="number" 
                className="form-input" 
                value={epochs} 
                onChange={(e) => setEpochs(Math.max(5, Math.min(100, parseInt(e.target.value) || 25)))}
                disabled={isTraining}
                style={{ fontSize: "0.85rem", padding: "0.45rem" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                Batch Size
              </label>
              <select 
                className="form-input" 
                value={batchSize} 
                onChange={(e) => setBatchSize(parseInt(e.target.value))}
                disabled={isTraining}
                style={{ fontSize: "0.85rem", padding: "0.45rem" }}
              >
                <option value={8}>8 (Low RAM)</option>
                <option value={16}>16 (Standard)</option>
                <option value={32}>32 (High Performance GPU)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                Initial Learning Rate (lr0)
              </label>
              <select 
                className="form-input" 
                value={learningRate} 
                onChange={(e) => setLearningRate(e.target.value)}
                disabled={isTraining}
                style={{ fontSize: "0.85rem", padding: "0.45rem" }}
              >
                <option value="0.001">0.001 (AdamW Optimizer)</option>
                <option value="0.01">0.01 (SGD + Momentum)</option>
              </select>
            </div>
          </div>

          {/* Data Augmentation Checkboxes */}
          <div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
              Indian Road Augmentation Pipelines
            </span>
            <div style={{ display: "flex", gap: "1.25rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={enableMonsoonAug} 
                  onChange={() => setEnableMonsoonAug(!enableMonsoonAug)} 
                  disabled={isTraining}
                />
                Monsoon Rain & Water Reflection
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={enableNightAug} 
                  onChange={() => setEnableNightAug(!enableNightAug)} 
                  disabled={isTraining}
                />
                Night Headlight Glare
              </label>
            </div>
          </div>

          {/* Start Training CTA */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button 
              className="btn-primary" 
              onClick={handleStartTraining} 
              disabled={isTraining}
              style={{ flexGrow: 1, padding: "0.75rem" }}
            >
              {isTraining ? <Pause size={18} /> : <Play size={18} />}
              {isTraining ? `Training Epoch ${currentEpoch}/${epochs}...` : "Train Custom AI Model"}
            </button>

            {isTrained && (
              <button 
                className="btn-secondary" 
                onClick={() => alert(`Downloaded civiceye_${selectedArchitecture}_india_best.onnx weights file!`)}
                style={{ borderColor: "var(--color-success)", color: "var(--color-success)" }}
              >
                <Download size={16} /> Export ONNX
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Training Live Progress & Loss Curve Section */}
      {(isTraining || isTrained || currentEpoch > 0) && (
        <div className="glass-card animate-fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          
          {/* Left: Interactive Training Loss Curve SVG */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "bold", color: "#fff", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <LineChart size={18} style={{ color: "var(--accent-secondary)" }} />
                Real-Time Loss Convergence & mAP@50 Graph
              </h4>
              <span className="badge badge-resolved">
                mAP@50: {currentMap}%
              </span>
            </div>

            <div style={{ position: "relative", width: "100%", height: "180px", background: "rgba(0,0,0,0.3)", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--border-color)", padding: "10px" }}>
              <svg viewBox="0 0 300 120" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                <defs>
                  <linearGradient id="loss-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity="0.45"/>
                    <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                
                <line x1="0" y1="30" x2="300" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="70" x2="300" y2="70" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="110" x2="300" y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                {lossHistory.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="var(--accent-secondary)"
                    strokeWidth="3"
                    points={lossHistory.map((val, idx) => {
                      const x = (idx / (epochs || 25)) * 290 + 5;
                      const y = 110 - (1 - val) * 90;
                      return `${x},${y}`;
                    }).join(" ")}
                  />
                )}
              </svg>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              <span>Epoch 0 (Loss: 0.85)</span>
              <span>Epoch {currentEpoch} (Loss: {currentLoss})</span>
              <span>Target: 0.04</span>
            </div>
          </div>

          {/* Right: Live Training Console Terminal */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "bold", color: "#fff", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FileCode size={18} style={{ color: "var(--accent-primary)" }} />
              Training Terminal Output
            </h4>

            {/* Progress bar */}
            <div style={{ width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: "99px", height: "8px", overflow: "hidden" }}>
              <div 
                style={{ 
                  width: `${trainingProgress}%`, 
                  height: "100%", 
                  background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
                  transition: "width 0.3s ease" 
                }} 
              />
            </div>

            <div 
              style={{ 
                background: "rgba(0, 0, 0, 0.6)", 
                border: "1px solid var(--border-color)", 
                borderRadius: "var(--border-radius-sm)", 
                padding: "0.85rem", 
                fontFamily: "var(--font-mono)", 
                fontSize: "0.78rem", 
                height: "140px", 
                overflowY: "auto",
                display: "flex",
                flexDirection: "column-reverse",
                gap: "0.35rem"
              }}
            >
              {trainLogs.map((log, i) => (
                <div key={i} style={{ color: log.text.includes("✅") ? "var(--color-success)" : log.text.includes("🚀") ? "var(--accent-secondary)" : "#cbd5e1" }}>
                  <span style={{ color: "var(--text-muted)", marginRight: "0.5rem" }}>[{log.time}]</span>
                  {log.text}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
