// Seed dataset for CivicEye India — Potholes, Speed Breakers, Open Manholes & Road Hazards

export const INDIAN_CITIES = {
  bengaluru: {
    name: "Bengaluru (Silicon Valley)",
    lat: 12.9716,
    lng: 77.5946,
    zoom: 13,
    authority: "BBMP (Bruhat Bengaluru Mahanagara Palike)",
    wardCount: 225,
    sampleOrigin: [12.9784, 77.6408], // Indiranagar
    sampleDestination: [12.9290, 77.6810], // Bellandur ORR
    waypoints: {
      direct: [[12.9352, 77.6245], [12.9177, 77.6238]], // Silk Board
      alternate: [[12.9550, 77.6500], [12.9240, 77.6530]] // Agara Flyover
    }
  },
  mumbai: {
    name: "Mumbai Metropolis",
    lat: 19.0760,
    lng: 72.8777,
    zoom: 13,
    authority: "MCGM (Brihanmumbai Municipal Corporation)",
    wardCount: 24,
    sampleOrigin: [19.0596, 72.8295], // Bandra West
    sampleDestination: [19.1197, 72.8464], // Andheri East
    waypoints: {
      direct: [[19.0760, 72.8400], [19.0950, 72.8450]], // WEH
      alternate: [[19.0650, 72.8350], [19.1050, 72.8380]] // SV Road
    }
  },
  delhi: {
    name: "Delhi NCR",
    lat: 28.5800,
    lng: 77.2200,
    zoom: 13,
    authority: "Delhi PWD & NHAI",
    wardCount: 250,
    sampleOrigin: [28.5800, 77.2200], // CP
    sampleDestination: [28.4595, 77.0266], // Cyber City Gurgaon
    waypoints: {
      direct: [[28.5400, 77.1200], [28.5000, 77.0800]], // NH-48 Expressway
      alternate: [[28.5500, 77.1600], [28.5100, 77.0500]] // Mehrauli-Gurgaon Rd
    }
  }
};

// Real-life Dashcam Footage Online Video Streams & Samples
export const REAL_DASHCAM_VIDEOS = [
  {
    id: "intel-dashcam-drive",
    title: "Highway & Urban Dashcam (Intel IoT Vision Stream)",
    city: "Bengaluru",
    location: "Silk Board to Bellandur Tech Corridor",
    duration: "1:00",
    videoUrl: "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/car-detection.mp4",
    poster: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop",
    expectedHazards: [
      { timestampSec: 2, category: "Pothole", severity: "Critical", x: 40, y: 60, w: 24, h: 20, label: "Pothole (D40)", conf: "95%", distanceM: "8.4m" },
      { timestampSec: 6, category: "Unmarked Speed Breaker", severity: "Moderate", x: 32, y: 65, w: 38, h: 18, label: "Unmarked Hump", conf: "89%", distanceM: "14.2m" },
      { timestampSec: 11, category: "Open Manhole", severity: "Critical", x: 54, y: 56, w: 18, h: 22, label: "Open Manhole", conf: "97%", distanceM: "5.1m" },
      { timestampSec: 16, category: "Pothole", severity: "Critical", x: 28, y: 64, w: 30, h: 24, label: "Deep Asphalt Crater", conf: "92%", distanceM: "11.0m" }
    ]
  },
  {
    id: "bengaluru-dashcam-1",
    title: "Bengaluru Outer Ring Road - Real Dashcam Stream",
    city: "Bengaluru",
    location: "Bellandur Flyover to Marathahalli",
    duration: "0:45",
    videoUrl: "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/person-bicycle-car-detection.mp4",
    poster: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop",
    expectedHazards: [
      { timestampSec: 3, category: "Pothole", severity: "Critical", x: 42, y: 62, w: 26, h: 22, label: "Pothole (D40)", conf: "94%", distanceM: "9.2m" },
      { timestampSec: 8, category: "Unmarked Speed Breaker", severity: "Moderate", x: 30, y: 68, w: 40, h: 18, label: "Unmarked Hump", conf: "88%", distanceM: "12.5m" },
      { timestampSec: 14, category: "Open Manhole", severity: "Critical", x: 55, y: 58, w: 20, h: 24, label: "Open Manhole", conf: "96%", distanceM: "6.7m" }
    ]
  },
  {
    id: "mumbai-dashcam-monsoon",
    title: "Mumbai WEH - Monsoon Wet Road Drive",
    city: "Mumbai",
    location: "Western Express Highway, Bandra Flyover",
    duration: "0:30",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop",
    expectedHazards: [
      { timestampSec: 4, category: "Monsoon Waterlogged Pit", severity: "Critical", x: 38, y: 55, w: 32, h: 28, label: "Waterlogged Pit", conf: "92%", distanceM: "7.0m" },
      { timestampSec: 10, category: "Pothole", severity: "Critical", x: 22, y: 64, w: 28, h: 20, label: "Pothole (D40)", conf: "95%", distanceM: "10.3m" }
    ]
  },
  {
    id: "delhi-dashcam-expressway",
    title: "Delhi NH-48 Gurgaon - High Speed Corridor",
    city: "Delhi NCR",
    location: "NH-48 Cyber City Highway Exit",
    duration: "0:50",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop",
    expectedHazards: [
      { timestampSec: 5, category: "Unmarked Speed Breaker", severity: "Moderate", x: 35, y: 60, w: 36, h: 20, label: "Unmarked Hump", conf: "89%", distanceM: "15.0m" },
      { timestampSec: 12, category: "Pothole", severity: "Critical", x: 48, y: 66, w: 24, h: 22, label: "Pothole (D40)", conf: "91%", distanceM: "8.8m" }
    ]
  }
];


export const INITIAL_ISSUES = [
  {
    id: "BBMP-8041",
    category: "Pothole",
    description: "Axle-breaker deep pothole near Silk Board flyover exit. Causes severe traffic bottleneck.",
    severity: "Critical",
    status: "Pending",
    source: "Dashcam AI",
    latitude: 12.9177,
    longitude: 77.6238,
    timestamp: "2026-08-08T18:30:00Z",
    city: "bengaluru",
    address: "Silk Board Junction, Outer Ring Rd, Bengaluru, Karnataka",
    ward: "Ward 174 (HSR Layout)",
    authority: "BBMP Roads Dept",
    estRepairCost: "₹18,500",
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop"
  },
  {
    id: "BBMP-8042",
    category: "Unmarked Speed Breaker",
    description: "Hazardous unpainted asphalt speed hump without reflector studs. Danger for nighttime 2-wheelers.",
    severity: "Critical",
    status: "Assigned",
    source: "Dashcam AI",
    latitude: 12.9352,
    longitude: 77.6245,
    timestamp: "2026-08-08T17:15:00Z",
    city: "bengaluru",
    address: "Koramangala 80ft Road, Bengaluru, Karnataka",
    ward: "Ward 151 (Koramangala)",
    authority: "BBMP Traffic Cell",
    estRepairCost: "₹8,000",
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop"
  },
  {
    id: "BBMP-8043",
    category: "Monsoon Waterlogged Pit",
    description: "Rainwater accumulated in 4-inch deep road crater near Bellandur tech park entrance.",
    severity: "Critical",
    status: "Pending",
    source: "Citizen App",
    latitude: 12.9290,
    longitude: 77.6810,
    timestamp: "2026-08-08T16:00:00Z",
    city: "bengaluru",
    address: "Outer Ring Road, Bellandur, Bengaluru, Karnataka",
    ward: "Ward 150 (Bellandur)",
    authority: "BBMP Stormwater Dept",
    estRepairCost: "₹35,000",
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop"
  },
  {
    id: "BBMP-8044",
    category: "Open Manhole",
    description: "Missing iron manhole cover on pedestrian sidewalk edge.",
    severity: "Critical",
    status: "Pending",
    source: "Dashcam AI",
    latitude: 12.9784,
    longitude: 77.6408,
    timestamp: "2026-08-08T14:45:00Z",
    city: "bengaluru",
    address: "100ft Road, Indiranagar, Bengaluru, Karnataka",
    ward: "Ward 80 (Hoysala Nagar)",
    authority: "BWSSB & BBMP",
    estRepairCost: "₹12,000",
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop"
  },
  {
    id: "MCGM-3021",
    category: "Pothole",
    description: "Series of 3 connected potholes on southbound lane during monsoon showers.",
    severity: "Moderate",
    status: "Resolved",
    source: "Dashcam AI",
    latitude: 19.0596,
    longitude: 72.8295,
    timestamp: "2026-08-08T11:20:00Z",
    city: "mumbai",
    address: "Western Express Highway, Bandra West, Mumbai, Maharashtra",
    ward: "Zone 3 (H-West Ward)",
    authority: "MCGM Roads",
    estRepairCost: "₹22,000",
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop"
  },
  {
    id: "NHAI-9012",
    category: "Unmarked Speed Breaker",
    description: "Illegal plastic speed bump placed on highway service lane.",
    severity: "Moderate",
    status: "Pending",
    source: "Manual Report",
    latitude: 28.4595,
    longitude: 77.0266,
    timestamp: "2026-08-08T13:00:00Z",
    city: "delhi",
    address: "NH-48 Gurgaon Expressway, Cyber City Toll, NCR",
    ward: "Gurugram Zone 2",
    authority: "NHAI Division",
    estRepairCost: "₹15,000",
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop"
  }
];

// Sample Real-world Indian Road Datasets for Custom AI Training Studio
export const INDIAN_DATASETS = [
  {
    id: "rdd-2022-in",
    name: "RDD2022 — India Road Defect Dataset",
    framesCount: 14320,
    classes: ["Pothole (D40)", "Longitudinal Crack (D00)", "Transverse Crack (D10)", "Alligator Crack (D20)"],
    source: "Crowdsourced Dashcams (Mumbai, Delhi, Pune, Bengaluru)",
    sampleImg: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop",
    annotationsCount: 28450,
    mAP50: "84.6%"
  },
  {
    id: "crip-india",
    name: "CRIP-IN — Speed Breakers & Open Manholes",
    framesCount: 6850,
    classes: ["Unmarked Hump", "Open Manhole", "Faded Zebra Marking", "Road Debris"],
    source: "Smart City CCTV & Dashcam Telemetry",
    sampleImg: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop",
    annotationsCount: 11200,
    mAP50: "89.2%"
  },
  {
    id: "monsoon-rdd",
    name: "Monsoon Waterlogged Defect Corpus",
    framesCount: 4200,
    classes: ["Waterlogged Hole", "Submerged Trench", "Asphalt Erosion"],
    source: "Mumbai & Kerala Heavy Rain Mobility Study",
    sampleImg: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop",
    annotationsCount: 8900,
    mAP50: "81.4%"
  }
];

export const PRETRAINED_MODELS = [
  {
    id: "yolov8-nano-in",
    name: "YOLOv8-IndiaRoads-Nano (Edge Optimized)",
    size: "2.8 MB",
    speed: "48 FPS (Edge Jetson / Mobile)",
    precision: "84.2%",
    description: "Tuned on RDD2022 India dataset. Ultra-lightweight real-time inference."
  },
  {
    id: "yolov8-medium-in",
    name: "YOLOv8-IndiaRoads-Medium (High Accuracy)",
    size: "18.4 MB",
    speed: "32 FPS (GPU Server)",
    precision: "91.8%",
    description: "Enhanced multi-scale feature extractor for small potholes & night rain."
  }
];
