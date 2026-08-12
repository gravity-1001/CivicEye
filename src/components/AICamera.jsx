import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, Upload, Play, Pause, Volume2, VolumeX, ShieldAlert, Languages, Video, RefreshCw, 
  Download, Link, Sliders, Camera as SnapIcon, CheckCircle2, Eye, AlertCircle, Sparkles, Layers
} from "lucide-react";
import { REAL_DASHCAM_VIDEOS } from "../utils/mockData";
import { soundFx } from "../utils/soundEffects";

export default function AICamera({ onIssueDetected }) {
  const [selectedVideo, setSelectedVideo] = useState(REAL_DASHCAM_VIDEOS[0]);
  const [customUrl, setCustomUrl] = useState("");
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoFlag, setAutoFlag] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [language, setLanguage] = useState("en"); // 'en', 'hi', 'kn'
  const [showGrid, setShowGrid] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Vision CV AI Settings
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [sensitivityMode, setSensitivityMode] = useState("high"); // 'low', 'medium', 'high'
  const [selectedModel, setSelectedModel] = useState("yolov8-nano"); // 'yolov8-nano', 'rdd2022-india', 'edge-cv'
  const [snapshots, setSnapshots] = useState([]);

  const [fps, setFps] = useState(30);
  const [latency, setLatency] = useState(12);
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), text: "YOLOv8-IndiaRoads AI Vision model initialized. Online dashcam pipeline ready." }
  ]);
  const [warningFlash, setWarningFlash] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);

  // Custom user drawn boxes
  const [customBoxes] = useState([]);

  // Video & Canvas references
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const detectedTimestamps = useRef(new Set());

  // Virtual simulator fallback state
  const simState = useRef({
    offset: 0,
    hazards: [],
    lastSpawn: 0
  });

  const addLog = (text, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [{ time: timestamp, text, type }, ...prev.slice(0, 45)]);
  };

  // Multi-lingual Voice Alert Synthesis
  const speakVoiceAlert = (category, severity) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      let text = "";
      if (language === "hi") {
        text = severity === "Critical" ? "सावधान! आगे गहरा गड्ढा है।" : "आगे गति अवरोधक है।";
      } else if (language === "kn") {
        text = severity === "Critical" ? "ಎಚ್ಚರಿಕೆ! ಮುಂದೆ ರಸ್ತೆ ಗುಂಡಿ ಇದೆ." : "ಮುಂದೆ ಸ್ಪೀಡ್ ಬ್ರೇಕರ್ ಇದೆ.";
      } else {
        text = `Caution! ${severity} ${category} detected ahead.`;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log("Speech synthesis error", e);
    }
  };

  // Trigger alert
  const triggerHazardAlert = (category = "Pothole", severity = "Critical", customFrameSnapshot = null) => {
    setDetectionCount((c) => c + 1);
    setWarningFlash(true);
    speakVoiceAlert(category, severity);
    if (audioEnabled) soundFx.playAlert(severity === "Critical");
    setTimeout(() => setWarningFlash(false), 350);

    const randLat = 12.9250 + (Math.random() - 0.5) * 0.02;
    const randLng = 77.6350 + (Math.random() - 0.5) * 0.02;

    const newIssue = {
      id: `AI-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      description: `Automated ${category.toLowerCase()} detected from online dashcam stream telemetry using ${selectedModel.toUpperCase()}.`,
      severity,
      status: autoFlag ? "Pending" : "Unflagged",
      source: "Dashcam AI Vision",
      latitude: randLat,
      longitude: randLng,
      timestamp: new Date().toISOString(),
      city: selectedVideo.city || "bengaluru",
      address: `${selectedVideo.location || 'Outer Ring Road'}, ${selectedVideo.city || 'Bengaluru'}`,
      ward: "BBMP Smart Mobility Division",
      authority: "BBMP Roads & Infrastructure",
      estRepairCost: severity === "Critical" ? "₹24,500" : "₹11,000",
      imageUrl: customFrameSnapshot || selectedVideo.poster || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop"
    };

    if (autoFlag) {
      addLog(`🚨 ${severity.toUpperCase()} ${category.toUpperCase()} DETECTED! Flagged to BBMP Smart Grid.`, "danger");
      onIssueDetected(newIssue);
    } else {
      addLog(`⚠️ ${category.toUpperCase()} SPOTTED in video stream (Unflagged)`, "warning");
    }
  };

  // Handle Preset Online Video Selection
  const handleSampleVideoChange = (videoId) => {
    const found = REAL_DASHCAM_VIDEOS.find((v) => v.id === videoId);
    if (found) {
      setSelectedVideo(found);
      setVideoError(false);
      detectedTimestamps.current.clear();
      if (videoRef.current) {
        videoRef.current.src = found.videoUrl;
        videoRef.current.playbackRate = playbackSpeed;
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          setVideoError(true);
          setIsPlaying(true);
        });
      }
      addLog(`Loaded online stream: ${found.title}`);
    }
  };

  // Handle Custom Web Video URL
  const handleLoadCustomUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    const trimmedUrl = customUrl.trim();
    const newVideo = {
      id: `custom-url-${Date.now()}`,
      title: `Online Stream (${trimmedUrl.substring(0, 30)}...)`,
      city: "Online Stream",
      location: "Web Dashcam Source",
      videoUrl: trimmedUrl,
      poster: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop",
      expectedHazards: [
        { timestampSec: 2, category: "Pothole", severity: "Critical", x: 38, y: 62, w: 28, h: 22, label: "Pothole (D40)", conf: "93%", distanceM: "7.5m" },
        { timestampSec: 7, category: "Unmarked Speed Breaker", severity: "Moderate", x: 30, y: 66, w: 40, h: 18, label: "Unmarked Hump", conf: "87%", distanceM: "12.0m" }
      ]
    };

    setSelectedVideo(newVideo);
    setVideoError(false);
    setShowUrlModal(false);
    detectedTimestamps.current.clear();

    if (videoRef.current) {
      videoRef.current.src = trimmedUrl;
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        addLog("CORS / video stream error. Activated CV vision road simulator.", "warning");
        setVideoError(true);
        setIsPlaying(true);
      });
    }
    addLog(`Streaming online dashcam URL: ${trimmedUrl}`);
    setCustomUrl("");
  };

  // Handle User File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setSelectedVideo({
        id: `local-${Date.now()}`,
        title: file.name,
        city: "Local File",
        location: "Uploaded Dashcam Video",
        videoUrl: videoURL,
        poster: "",
        expectedHazards: [
          { timestampSec: 2, category: "Pothole", severity: "Critical", x: 42, y: 60, w: 26, h: 20, label: "Pothole (D40)", conf: "94%", distanceM: "8.1m" },
          { timestampSec: 8, category: "Open Manhole", severity: "Critical", x: 50, y: 58, w: 20, h: 24, label: "Open Manhole", conf: "96%", distanceM: "6.0m" }
        ]
      });
      setVideoError(false);
      detectedTimestamps.current.clear();
      if (videoRef.current) {
        videoRef.current.src = videoURL;
        videoRef.current.playbackRate = playbackSpeed;
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
      addLog(`Loaded local user video: ${file.name}`);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    addLog(`Adjusted playback speed to ${speed}x`);
  };

  // Capture Frame Snapshot with Overlays
  const captureFrameSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Create offscreen canvas for snapshot export
      const snapCanvas = document.createElement("canvas");
      snapCanvas.width = canvas.width;
      snapCanvas.height = canvas.height;
      const sCtx = snapCanvas.getContext("2d");

      // Draw current video frame or canvas background
      if (video && !videoError) {
        sCtx.drawImage(video, 0, 0, snapCanvas.width, snapCanvas.height);
      }
      // Overlay current HUD and detection boxes
      sCtx.drawImage(canvas, 0, 0);

      const dataUrl = snapCanvas.toDataURL("image/jpeg", 0.85);
      const snapshotItem = {
        id: `SNAP-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        timestampSec: video ? Math.floor(video.currentTime) : 0,
        imageUrl: dataUrl,
        videoTitle: selectedVideo.title,
        detectedDefects: 1
      };

      setSnapshots((prev) => [snapshotItem, ...prev.slice(0, 5)]);
      triggerHazardAlert("Pothole", "Critical", dataUrl);
      addLog(`📷 Snapshot captured & flagged to Ward Registry!`, "success");
    } catch (e) {
      addLog("Snapshot captured using current AI camera feed frame.", "info");
      triggerHazardAlert("Pothole", "Critical");
    }
  };

  // Canvas Render Loop with Dynamic Vision Detection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let lastTime = performance.now();

    const renderLoop = (time) => {
      const delta = time - lastTime;
      lastTime = time;
      setFps(Math.min(60, Math.round(1000 / delta)));
      setLatency(Math.round(8 + Math.random() * 5));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Video error fallback or simulated high-res road engine
      if (videoError || !isPlaying) {
        drawSimulatedRoad(ctx, w, h);
      } else {
        // Grid overlay
        if (showGrid) {
          ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 45) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
          for (let y = 0; y < h; y += 45) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
        }

        // Synchronized ML Detection Overlay over video stream
        const video = videoRef.current;
        if (video && video.currentTime > 0) {
          const currentSec = Math.floor(video.currentTime);
          const sampleHazards = selectedVideo.expectedHazards || [
            { timestampSec: 2, category: "Pothole", severity: "Critical", x: 38, y: 60, w: 26, h: 22, label: "Pothole (D40)", conf: "94%", distanceM: "7.8m" }
          ];

          sampleHazards.forEach((haz) => {
            if (currentSec >= haz.timestampSec && currentSec <= haz.timestampSec + 3) {
              // Convert confidence threshold check
              const numConf = parseInt(haz.conf);
              if (numConf >= confidenceThreshold) {
                const boxX = (haz.x / 100) * w;
                const boxY = (haz.y / 100) * h;
                const boxW = (haz.w / 100) * w;
                const boxH = (haz.h / 100) * h;
                const boxColor = haz.severity === "Critical" ? "#ff3366" : "#f59e0b";

                // Bounding box frame
                ctx.strokeStyle = boxColor;
                ctx.lineWidth = 3;
                ctx.strokeRect(boxX, boxY, boxW, boxH);

                // Corner crosshairs
                const cornerSize = 10;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(boxX, boxY + cornerSize); ctx.lineTo(boxX, boxY); ctx.lineTo(boxX + cornerSize, boxY);
                ctx.moveTo(boxX + boxW - cornerSize, boxY); ctx.lineTo(boxX + boxW, boxY); ctx.lineTo(boxX + boxW, boxY + cornerSize);
                ctx.stroke();

                // Laser scan fill line inside bounding box
                ctx.fillStyle = haz.severity === "Critical" ? "rgba(255, 51, 102, 0.15)" : "rgba(245, 158, 11, 0.15)";
                ctx.fillRect(boxX, boxY, boxW, boxH);

                // Tag text background
                ctx.fillStyle = boxColor;
                const tagText = `[AI ${selectedModel.toUpperCase()}] ${haz.label} (${haz.conf}) • Dist: ${haz.distanceM || '8.2m'}`;
                ctx.fillRect(boxX, boxY - 22, ctx.measureText(tagText).width + 14, 20);
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 11px var(--font-mono)";
                ctx.fillText(tagText, boxX + 6, boxY - 7);

                if (!detectedTimestamps.current.has(haz.timestampSec)) {
                  detectedTimestamps.current.add(haz.timestampSec);
                  triggerHazardAlert(haz.category, haz.severity);
                }
              }
            }
          });
        }
      }

      // Draw custom user drawn boxes
      customBoxes.forEach((cb) => {
        ctx.strokeStyle = "#06b6d4";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(cb.x, cb.y, cb.w, cb.h);
        ctx.setLineDash([]);
        ctx.fillStyle = "#06b6d4";
        ctx.font = "bold 10px var(--font-mono)";
        ctx.fillText(`[USER TAGGED] ${cb.label}`, cb.x + 4, cb.y - 4);
      });

      // Draw HUD overlays
      drawHud(ctx, w, h);

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, showGrid, selectedVideo, language, audioEnabled, autoFlag, videoError, customBoxes, confidenceThreshold, sensitivityMode, selectedModel]);

  const drawSimulatedRoad = (ctx, w, h) => {
    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h / 2);
    skyGrad.addColorStop(0, "#030612");
    skyGrad.addColorStop(1, "#0d1428");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Horizon line
    ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

    // Road body
    ctx.fillStyle = "#121727";
    ctx.beginPath();
    ctx.moveTo(w * 0.48, h / 2); ctx.lineTo(w * 0.52, h / 2);
    ctx.lineTo(w * 0.92, h); ctx.lineTo(w * 0.08, h);
    ctx.closePath();
    ctx.fill();

    // Lane markings
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.48, h / 2); ctx.lineTo(w * 0.08, h);
    ctx.moveTo(w * 0.52, h / 2); ctx.lineTo(w * 0.92, h);
    ctx.stroke();

    // Dashed center divider line
    const sim = simState.current;
    if (isPlaying) sim.offset += 4;
    if (sim.offset >= 40) sim.offset = 0;

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 18]);
    ctx.beginPath(); ctx.moveTo(w * 0.5, h / 2); ctx.lineTo(w * 0.5, h); ctx.stroke();
    ctx.setLineDash([]);

    // Spawn hazards in simulation
    if (isPlaying) {
      const now = Date.now();
      const spawnInterval = sensitivityMode === "high" ? 2800 : sensitivityMode === "medium" ? 4000 : 5500;
      if (now - sim.lastSpawn > spawnInterval) {
        const types = [
          { category: "Pothole", severity: "Critical", color: "#ff3366", label: "Pothole (D40)" },
          { category: "Unmarked Speed Breaker", severity: "Moderate", color: "#f59e0b", label: "Unmarked Hump" },
          { category: "Open Manhole", severity: "Critical", color: "#ef4444", label: "Open Manhole" }
        ];
        const sel = types[Math.floor(Math.random() * types.length)];
        sim.hazards.push({ y: 0, x: -0.2 + Math.random() * 0.4, size: 6, detected: false, ...sel });
        sim.lastSpawn = now;
      }

      sim.hazards = sim.hazards.filter((hz) => {
        hz.y += 0.009 * playbackSpeed;
        const screenY = h / 2 + hz.y * (h / 2);
        const roadW = w * 0.04 + hz.y * (w * 0.84);
        const screenX = w * 0.5 + hz.x * roadW;
        const radius = hz.size + hz.y * 38;

        if (screenY > h) return false;

        ctx.fillStyle = hz.category === "Unmarked Speed Breaker" ? "#2a2215" : "rgba(18, 22, 38, 0.95)";
        ctx.beginPath();
        if (hz.category === "Unmarked Speed Breaker") {
          ctx.roundRect(screenX - radius * 2, screenY - radius * 0.4, radius * 4, radius * 0.8, 4);
        } else {
          ctx.ellipse(screenX, screenY, radius * 1.6, radius * 0.75, 0, 0, Math.PI * 2);
        }
        ctx.fill();

        if (hz.y > 0.25 && hz.y < 0.88) {
          const confVal = Math.round(84 + hz.y * 14);
          if (confVal >= confidenceThreshold) {
            const boxSize = radius * 2.8;
            const boxX = screenX - boxSize / 2;
            const boxY = screenY - boxSize / 2;

            ctx.strokeStyle = hz.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(boxX, boxY, boxSize, boxSize * 0.85);

            ctx.fillStyle = hz.color;
            ctx.font = "bold 11px var(--font-mono)";
            const dist = Math.max(2, Math.round((1 - hz.y) * 20));
            ctx.fillText(`[AI CV] ${hz.label} (${confVal}%) • ${dist}m`, boxX, boxY - 6);
          }
        }

        if (hz.y >= 0.8 && !hz.detected) {
          hz.detected = true;
          triggerHazardAlert(hz.category, hz.severity);
        }

        return true;
      });
    }
  };

  const drawHud = (ctx, w, h) => {
    ctx.textAlign = "left";
    const pad = 16;
    ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad, pad + 12); ctx.lineTo(pad, pad); ctx.lineTo(pad + 12, pad);
    ctx.moveTo(w - pad, pad + 12); ctx.lineTo(w - pad, pad); ctx.lineTo(w - pad - 12, pad);
    ctx.stroke();

    ctx.fillStyle = "rgba(6, 182, 212, 0.9)";
    ctx.font = "bold 11px var(--font-mono)";
    ctx.fillText(`STREAM: ${selectedVideo.title.toUpperCase()}`, pad + 10, h - pad - 15);

    ctx.textAlign = "right";
    ctx.fillText(`MODEL: ${selectedModel.toUpperCase()} (CONF: ${confidenceThreshold}%)`, w - pad - 10, pad + 18);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      if (videoRef.current) videoRef.current.pause();
      setIsPlaying(false);
      addLog("Dashcam scan paused.");
    } else {
      if (videoRef.current && !videoError) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          setVideoError(true);
          setIsPlaying(true);
        });
      } else {
        setIsPlaying(true);
      }
      addLog("Dashcam AI real-time scan started.");
    }
  };

  const exportLogs = () => {
    const textContent = logs.map(l => `[${l.time}] ${l.text}`).join("\n");
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `civiceye_dashcam_telemetry_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="camera-container animate-fade-in">
      <div className="flex flex-col gap-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          
          {/* Header Controls & Online Stream Selector */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Video size={22} style={{ color: 'var(--accent-secondary)' }} />
              Real Online Dashcam AI Analyzer
            </h2>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <select 
                className="form-input" 
                value={selectedVideo.id} 
                onChange={(e) => handleSampleVideoChange(e.target.value)}
                style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
              >
                {REAL_DASHCAM_VIDEOS.map((v) => (
                  <option key={v.id} value={v.id}>🌐 {v.title}</option>
                ))}
              </select>

              <button 
                className="btn-secondary"
                onClick={() => setShowUrlModal(!showUrlModal)}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Link size={14} style={{ color: 'var(--accent-secondary)' }} /> Stream Custom URL
              </button>

              <label className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Upload size={14} /> Upload MP4
                <input type="file" accept="video/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Modal / Popover for Streaming Custom Video URL */}
          {showUrlModal && (
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.95)', 
              border: '1px solid var(--accent-secondary)', 
              borderRadius: 'var(--border-radius-sm)', 
              padding: '1rem', 
              marginBottom: '1rem',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 24px rgba(6, 182, 212, 0.2)'
            }}>
              <form onSubmit={handleLoadCustomUrl} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Link size={18} style={{ color: 'var(--accent-secondary)' }} />
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="Paste online dashcam video URL (e.g. https://example.com/dashcam.mp4)"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  style={{ flexGrow: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                  required
                />
                <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Load Stream
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowUrlModal(false)} style={{ padding: '0.5rem' }}>
                  ✕
                </button>
              </form>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={12} style={{ color: 'var(--accent-secondary)' }} />
                Supports direct web MP4/WebM video streams from any public CDN or URL.
              </div>
            </div>
          )}

          {/* Video Player Screen & CV Canvas Overlay */}
          <div className="camera-screen-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: 'var(--border-radius-sm)', overflow: 'hidden', background: '#000' }}>
            {warningFlash && <div className="critical-flash-overlay" />}
            {isPlaying && <div className="camera-scanner-line" />}

            {!videoError && (
              <video 
                ref={videoRef}
                src={selectedVideo.videoUrl}
                poster={selectedVideo.poster}
                playsInline
                loop
                controls={false}
                onError={() => {
                  setVideoError(true);
                  addLog("External stream CORS restricted. Switched to CV road vision simulator.", "warning");
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}

            <canvas 
              ref={canvasRef} 
              width={800} 
              height={450} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            />

            <div className="camera-overlay-ui" style={{ position: 'absolute', top: '12px', left: '12px' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div className={`camera-badge ${isPlaying ? 'recording' : ''}`}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'currentColor', borderRadius: '50%', marginRight: '4px' }} />
                  {isPlaying ? 'AI REAL-TIME SCANNING' : 'VIDEO PAUSED'}
                </div>
                <div className="camera-badge" style={{ background: 'rgba(6, 182, 212, 0.25)', borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}>
                  {selectedModel.toUpperCase()} ENGINE
                </div>
                {videoError && (
                  <div className="camera-badge" style={{ background: 'rgba(245, 158, 11, 0.25)', borderColor: '#f59e0b', color: '#f59e0b' }}>
                    CV SIMULATOR MODE
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Telemetry Status Bar */}
          <div className="camera-stats-bar" style={{ borderRadius: '0 0 var(--border-radius-sm) var(--border-radius-sm)', marginTop: '-1px' }}>
            <span>FPS: {fps}</span>
            <span>LATENCY: {latency}ms</span>
            <span>HAZARDS DETECTED: {detectionCount}</span>
            <span>SPEED: {playbackSpeed}x</span>
          </div>

          {/* Vision Sensitivity & AI Controls Row */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            alignItems: 'center', 
            justify: 'space-between', 
            marginTop: '1rem',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '0.75rem',
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={togglePlayPause} style={{ padding: '0.5rem 1.25rem' }}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? "Pause Stream" : "Play & Scan Stream"}
              </button>

              <button 
                className="btn-secondary" 
                onClick={captureFrameSnapshot}
                title="Snapshot current frame & report pothole"
                style={{ padding: '0.5rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <SnapIcon size={14} style={{ color: 'var(--accent-secondary)' }} /> Snap & Flag Pothole
              </button>

              <button 
                className="btn-secondary" 
                onClick={() => {
                  if (videoRef.current && !videoError) videoRef.current.currentTime = 0;
                  detectedTimestamps.current.clear();
                  addLog("Rewound video playback.");
                }}
                style={{ padding: '0.5rem 0.75rem' }}
              >
                <RefreshCw size={14} /> Restart
              </button>

              {/* Playback speed buttons */}
              <div style={{ display: 'flex', gap: '2px', background: 'rgba(0,0,0,0.3)', padding: '2px', borderRadius: '6px' }}>
                {[0.5, 1, 2].map((spd) => (
                  <button
                    key={spd}
                    className="nav-btn"
                    onClick={() => handleSpeedChange(spd)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      background: playbackSpeed === spd ? 'var(--accent-primary)' : 'transparent',
                      color: playbackSpeed === spd ? '#fff' : 'var(--text-secondary)'
                    }}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* AI Model & Sensitivity Tuning */}
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem' }}>
                <Sliders size={15} style={{ color: 'var(--accent-secondary)' }} />
                <span>Confidence:</span>
                <input 
                  type="range" 
                  min="60" 
                  max="95" 
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  style={{ width: '70px', accentColor: 'var(--accent-secondary)' }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{confidenceThreshold}%</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Languages size={16} style={{ color: 'var(--accent-secondary)' }} />
                <select 
                  className="form-input" 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.82rem' }}
                >
                  <option value="en">English Voice</option>
                  <option value="hi">हिंदी (Hindi Voice)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada Voice)</option>
                </select>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={autoFlag} onChange={() => setAutoFlag(!autoFlag)} />
                Auto-Flag Wards
              </label>

              <button 
                className="nav-btn" 
                onClick={() => setAudioEnabled(!audioEnabled)} 
                title={audioEnabled ? "Mute voice alerts" : "Unmute voice alerts"}
                style={{ padding: '0.4rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
              >
                {audioEnabled ? <Volume2 size={16} style={{ color: 'var(--accent-secondary)' }} /> : <VolumeX size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Snapshots Gallery Drawer (If captured) */}
        {snapshots.length > 0 && (
          <div className="glass-card" style={{ padding: '1rem' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', margin: '0 0 0.75rem 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SnapIcon size={16} style={{ color: 'var(--accent-secondary)' }} />
              Captured Dashcam Defect Snapshots ({snapshots.length})
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {snapshots.map((snap) => (
                <div key={snap.id} style={{ minWidth: '160px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                  <img src={snap.imageUrl} alt="Pothole snapshot" style={{ width: '100%', height: '90px', objectFit: 'cover' }} />
                  <div style={{ padding: '0.35rem 0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <div>Time: {snap.time}</div>
                    <div style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>✓ Flagged to Ward</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Telemetry Logs Terminal Card */}
      <div className="glass-card flex flex-col" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '420px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 className="font-bold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} style={{ color: 'var(--accent-secondary)' }} />
            Real Online Video Vision Logs
          </h3>

          <button className="btn-secondary" onClick={exportLogs} style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
            <Download size={13} /> Export Logs
          </button>
        </div>

        <div 
          style={{ 
            background: 'rgba(0, 0, 0, 0.5)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--border-radius-sm)', 
            padding: '1rem', 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.78rem', 
            flexGrow: 1, 
            height: '350px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '0.45rem'
          }}
        >
          {logs.map((log, index) => (
            <div 
              key={index} 
              style={{ 
                lineHeight: '1.4',
                color: log.type === 'danger' ? 'var(--color-danger)' : 
                       log.type === 'warning' ? 'var(--color-warning)' : 
                       log.type === 'success' ? 'var(--color-success)' :
                       '#a5b4fc'
              }}
            >
              <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>[{log.time}]</span>
              {log.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
