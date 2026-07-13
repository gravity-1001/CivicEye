# CivicEye
Road Health Monitoring, Hazard Prediction &amp; Smart Route Recommendation System

# CivicEye
### AI-Powered Smart Road Monitoring & Navigation System

CivicEye is an intelligent road safety platform that detects potholes using Computer Vision and Machine Learning, maps hazardous roads in real time, and recommends safer alternative routes to commuters.

Built to support Smart City initiatives, CivicEye helps citizens avoid damaged roads while enabling municipal authorities to prioritize road maintenance through data-driven insights.

---

##  Features

- 🛣️ **Real-Time Pothole Detection**
  - Detects potholes from uploaded images or live camera feed using YOLO.

- 📍 **GPS-Based Location Mapping**
  - Automatically records the location of detected potholes.

- 🗺️ **Interactive Hazard Map**
  - Displays reported potholes on an interactive map.

- 🚗 **Smart Route Recommendation**
  - Suggests safer alternative routes when the selected route contains multiple potholes.

- 📊 **Severity Classification**
  - Categorizes potholes based on size and estimated severity.

- 👥 **Crowdsourced Reporting**
  - Allows users to upload images and report road issues.

- 🏛️ **Municipal Dashboard**
  - Enables authorities to monitor, verify, and prioritize road repairs.

- 📈 **Analytics Dashboard**
  - Visualizes road conditions, hotspot locations, and repair statistics.

---

##  Problem Statement

Road damage causes:

- Vehicle damage
- Increased traffic congestion
- Road accidents
- Higher maintenance costs
- Delayed emergency response

Traditional reporting methods are slow, manual, and inefficient.

CivicEye automates the entire process using Artificial Intelligence.

---

##  Solution

CivicEye combines:

- Computer Vision
- Machine Learning
- GPS
- Interactive Maps
- Route Optimization

to create an intelligent platform that detects road defects, alerts users, and assists local authorities in making data-driven maintenance decisions.

---

##  System Workflow

```
Road Image / Camera Feed
            │
            ▼
     YOLO Detection Model
            │
            ▼
   Pothole Detection & Severity
            │
            ▼
      GPS Coordinates
            │
            ▼
      Database Storage
            │
            ▼
 Interactive Hazard Map
            │
            ▼
 Smart Route Recommendation
            │
            ▼
      User & Authority Dashboard
```

---

##  Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Leaflet / Google Maps API

### Backend
- Node.js
- Express.js

### AI / ML
- Python
- YOLOv8
- OpenCV

### Database
- MongoDB

### APIs
- Google Maps API
- Geolocation API

### Deployment
- Vercel
- Render

---

##  Project Structure

```
CivicEye/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── App.jsx
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── server.js
│
├── ai-model/
│   ├── train.py
│   ├── detect.py
│   ├── weights/
│   └── dataset/
│
├── screenshots/
│
├── README.md
└── requirements.txt
```

---

##  Screenshots

| Dashboard | Detection | Map |
|------------|-----------|-----|
| *(Add Screenshot)* | *(Add Screenshot)* | *(Add Screenshot)* |

---

##  Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/CivicEye.git
```

### Navigate

```bash
cd CivicEye
```

### Install Backend

```bash
npm install
```

### Install Frontend

```bash
cd frontend
npm install
```

### Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Run Backend

```bash
npm start
```

### Run Frontend

```bash
npm run dev
```

---

##  Future Improvements

- 📹 Live CCTV integration
- 🚦 Traffic-aware route optimization
- 🌧️ Rainfall prediction-based road damage alerts
- 📱 Android & iOS mobile application
- 🤖 Automatic municipal ticket generation
- 🚑 Emergency vehicle priority routing
- 🛰️ Drone-based road inspection
- 📡 IoT sensor integration

---

##  Sustainable Development Goals (SDGs)

CivicEye contributes to:

- 🎯 SDG 9 – Industry, Innovation & Infrastructure
- 🏙️ SDG 11 – Sustainable Cities & Communities
- ⚖️ SDG 16 – Peace, Justice & Strong Institutions
- 🤝 SDG 17 – Partnerships for the Goals

---

##  Expected Impact

- Faster pothole reporting
- Reduced road accidents
- Improved commuter safety
- Better road maintenance planning
- Lower vehicle repair costs
- Smarter urban infrastructure management

---

##  Contributors

- Garvit Uppal
- Anwarul Hassan
- Amaan Motan
- Shaikh Mohd. Talha

---

##  License

This project is developed for educational, research, and Smart City innovation purposes.

---

## ⭐ If you found this project useful, consider giving it a star!
