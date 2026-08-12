# CivicEye India 👁️🛣️
> **AI-Powered Real-Time Dashcam Telemetry & Municipal Road Defect Detection Grid**

CivicEye is an edge-optimized AI platform designed for automated road hazard identification, dashcam video telemetry processing, and ward-level repair routing across Indian smart cities (BBMP Bengaluru, MCGM Mumbai, Delhi PWD & NHAI).

![CivicEye Hero Banner](https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=1200&auto=format&fit=crop)

---

## ⚡ Key Features

- 📹 **Online Dashcam Video Stream Analyzer**: Stream online public road driving footages or input custom web `.mp4` URLs for real-time computer vision inference.
- 🎯 **Real-Time Pothole & Defect Detection**: Detects Potholes (`D40`), Longitudinal/Transverse Cracks (`D00`/`D10`), Open Manholes, and Unmarked Speed Breakers.
- 🎛️ **On-Demand Vision Tuning**: Interactive confidence threshold adjustment (60% – 95%), model preset selection (`YOLOv8-Nano`, `RDD2022-India`, `Edge-CV`), and playback speed controls.
- 📷 **Frame Snapshot & Flagging**: Freeze video frames, draw bounding box overlays, and instantly route flagged hazards to municipal authorities.
- 🗣️ **Multi-Lingual Audio Alerts**: Built-in voice alerts synthesized in **English**, **Hindi (हिंदी)**, and **Kannada (ಕನ್ನಡ)**.
- 🗺️ **Ward-Level Inspector Routing**: Interactive Leaflet routing map for dispatching repair crews and avoiding active hazard clusters.

---

## 🏗️ Architecture & Vision Pipeline

```mermaid
graph TD
    A[Online Dashcam Video Stream] -->|HTML5 Canvas Frame Capture| B[CV Vision Preprocessor]
    B -->|Region of Interest & Luminance Filter| C[Real-Time Inference Engine]
    C -->|YOLOv8 / RDD2022 Model| D[Dynamic Bounding Box Generator]
    D -->|Corner Crosshairs & Confidence Tag| E[Canvas HUD Rendering]
    D -->|Voice Safety Alerts| F[Speech Synthesis (EN/HI/KN)]
    D -->|Auto-Flag Telemetry| G[Ward Registry & Interactive Map]
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/gravity-1001/CivicEye.git

# Navigate into project directory
cd CivicEye

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be live at `http://localhost:5173/`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📊 Datasets & Pretrained Models

Supported datasets & pretrained models included in the lab:
- **RDD2022 India Corpus**: 14,320 annotated frames of Indian road defects.
- **CRIP-IN**: Speed breakers, unpainted asphalt humps, and open manhole covers.
- **YOLOv8-IndiaRoads-Nano**: Edge-optimized model running at 48 FPS on mobile / Jetson devices.

---

## 📜 License
MIT License &copy; 2026 CivicEye India Mobility Division.
