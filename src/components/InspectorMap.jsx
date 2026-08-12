import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Navigation, Plus, Sparkles, MapPin, Building2, CheckCircle2, ShieldAlert, ExternalLink, Route, Info } from "lucide-react";
import { INDIAN_CITIES } from "../utils/mockData";
import { soundFx } from "../utils/soundEffects";

export default function InspectorMap({ issues, onIssueDetected, onResolveIssue }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);

  const [activeCityKey, setActiveCityKey] = useState("bengaluru");
  const [selectedRoute, setSelectedRoute] = useState("alternate"); // 'direct', 'alternate'
  const [clickCoords, setClickCoords] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIssueSeverity, setNewIssueSeverity] = useState("Critical");
  const [newIssueCategory, setNewIssueCategory] = useState("Pothole");
  const [newIssueDesc, setNewIssueDesc] = useState("");

  const [routeStats, setRouteStats] = useState({ distanceKm: 8.4, durationMins: 22 });
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Current City Metadata
  const currentCity = INDIAN_CITIES[activeCityKey];

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      const city = INDIAN_CITIES[activeCityKey];
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false
      }).setView([city.lat, city.lng], city.zoom);

      // CartoDB Dark Matter tiles
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: "abcd",
        maxZoom: 20
      }).addTo(mapRef.current);

      L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);

      mapRef.current.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setClickCoords({ lat, lng });
        setShowAddForm(true);
        soundFx.playClick();
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle City Change FlyTo
  const handleCityChange = (cityKey) => {
    setActiveCityKey(cityKey);
    soundFx.playClick();
    const target = INDIAN_CITIES[cityKey];
    if (mapRef.current && target) {
      mapRef.current.flyTo([target.lat, target.lng], target.zoom, { duration: 1.5 });
    }
  };

  // Update Markers
  useEffect(() => {
    if (!mapRef.current) return;

    Object.keys(markersRef.current).forEach((id) => {
      mapRef.current.removeLayer(markersRef.current[id]);
    });
    markersRef.current = {};

    issues.forEach((issue) => {
      const isCritical = issue.severity === "Critical";
      const isResolved = issue.status === "Resolved";
      
      let pinClass = "custom-pin";
      if (isResolved) pinClass += " custom-pin-resolved";
      else if (isCritical) pinClass += " custom-pin-critical custom-pin-pulse";
      else pinClass += " custom-pin-moderate";

      const icon = L.divIcon({
        className: "",
        html: `<div class="${pinClass}" style="width: 22px; height: 22px;"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([issue.latitude, issue.longitude], { icon });

      const popupHtml = `
        <div style="font-family: var(--font-sans); width: 240px; padding: 4px;">
          <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #fff; display: flex; align-items: center; justify-content: space-between;">
            ${issue.category}
            <span style="font-size: 10px; padding: 2px 6px; border-radius: 99px; background: ${
              isResolved ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 51, 102, 0.2)"
            }; color: ${isResolved ? "var(--color-success)" : "var(--color-danger)"}; font-weight: bold;">
              ${issue.status.toUpperCase()}
            </span>
          </h4>
          <p style="font-size: 11px; color: var(--text-secondary); margin: 0 0 8px 0; line-height: 1.4;">${issue.description}</p>
          <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 8px; line-height: 1.5;">
            📍 ${issue.address.split(",")[0]}<br/>
            🏛️ ${issue.ward || "BBMP Ward"}<br/>
            💰 Est Repair: ${issue.estRepairCost || "₹15,000"}
          </div>
          ${
            !isResolved
              ? `<button id="btn-resolve-${issue.id}" style="width: 100%; background: linear-gradient(135deg, var(--accent-primary), #4f46e5); border: none; color: white; padding: 6px 8px; border-radius: 6px; font-size: 11px; cursor: pointer; font-weight: 700;">Mark Resolved by Engineer</button>`
              : `<div style="text-align: center; color: var(--color-success); font-size: 11px; font-weight: 700;">✓ Defect Repaired & Verified</div>`
          }
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on("popupopen", () => {
        soundFx.playClick();
        const resolveBtn = document.getElementById(`btn-resolve-${issue.id}`);
        if (resolveBtn) {
          resolveBtn.addEventListener("click", () => {
            onResolveIssue(issue.id);
            marker.closePopup();
          });
        }
      });

      marker.addTo(mapRef.current);
      markersRef.current[issue.id] = marker;
    });
  }, [issues, onResolveIssue]);

  // Fetch Real Road-Following Geometry from OSRM API
  useEffect(() => {
    if (!mapRef.current) return;

    const cityMeta = INDIAN_CITIES[activeCityKey];
    const origin = cityMeta.sampleOrigin; // [lat, lng]
    const dest = cityMeta.sampleDestination; // [lat, lng]
    const waypoints = cityMeta.waypoints[selectedRoute] || [];

    const coordsArray = [origin, ...waypoints, dest];
    const osrmCoordsStr = coordsArray.map(([lat, lng]) => `${lng},${lat}`).join(";");
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${osrmCoordsStr}?overview=full&geometries=geojson`;

    setIsLoadingRoute(true);

    fetch(osrmUrl)
      .then((res) => res.json())
      .then((data) => {
        setIsLoadingRoute(false);
        if (data.routes && data.routes.length > 0 && mapRef.current) {
          const routeData = data.routes[0];
          const geojsonCoords = routeData.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

          setRouteStats({
            distanceKm: (routeData.distance / 1000).toFixed(1),
            durationMins: Math.round(routeData.duration / 60)
          });

          if (polylineRef.current && mapRef.current.hasLayer(polylineRef.current)) {
            mapRef.current.removeLayer(polylineRef.current);
          }

          const pathColor = selectedRoute === "direct" ? "var(--color-danger)" : "var(--color-success)";

          polylineRef.current = L.polyline(geojsonCoords, {
            color: pathColor,
            weight: 6,
            opacity: 0.9,
            lineCap: "round",
            lineJoin: "round"
          }).addTo(mapRef.current);
        }
      })
      .catch((err) => {
        setIsLoadingRoute(false);
        console.error("OSRM Route Error, falling back:", err);
      });
  }, [activeCityKey, selectedRoute]);

  // Launch Google Maps Turn-by-Turn Navigation URL
  const launchGoogleMapsNavigation = () => {
    soundFx.playClick();
    const origin = currentCity.sampleOrigin;
    const dest = currentCity.sampleDestination;
    const waypointsStr = currentCity.waypoints[selectedRoute]
      ? currentCity.waypoints[selectedRoute].map(([lat, lng]) => `${lat},${lng}`).join("|")
      : "";

    let gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin[0]},${origin[1]}&destination=${dest[0]},${dest[1]}&travelmode=driving`;
    if (waypointsStr) {
      gmapsUrl += `&waypoints=${waypointsStr}`;
    }

    window.open(gmapsUrl, "_blank");
  };

  const handleManualFlagSubmit = (e) => {
    e.preventDefault();
    if (!clickCoords) return;

    const city = INDIAN_CITIES[activeCityKey];

    const newIssue = {
      id: `MAN-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newIssueCategory,
      description: newIssueDesc || "Manual defect report submitted by citizen/ward inspector.",
      severity: newIssueSeverity,
      status: "Pending",
      source: "Manual Citizen Report",
      latitude: clickCoords.lat,
      longitude: clickCoords.lng,
      timestamp: new Date().toISOString(),
      city: activeCityKey,
      address: `${city.name}, Lat: ${clickCoords.lat.toFixed(4)}, Lng: ${clickCoords.lng.toFixed(4)}`,
      ward: `${city.authority} Division`,
      estRepairCost: "₹14,000",
      imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop"
    };

    onIssueDetected(newIssue);
    setShowAddForm(false);
    setNewIssueDesc("");
    setClickCoords(null);
  };

  return (
    <div className="map-view-container animate-fade-in">
      {/* Left Canvas: Map */}
      <div style={{ position: 'relative', height: '100%' }}>
        <div ref={mapContainerRef} className="map-wrapper" />
        
        {/* City Switcher Bar */}
        <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 1000, display: 'flex', gap: '0.4rem' }}>
          {Object.keys(INDIAN_CITIES).map((key) => (
            <button
              key={key}
              className="city-selector"
              onClick={() => handleCityChange(key)}
              style={{
                background: activeCityKey === key ? "linear-gradient(135deg, var(--accent-primary) 0%, #4f46e5 100%)" : "rgba(10, 16, 32, 0.85)",
                color: "#fff",
                border: "1px solid " + (activeCityKey === key ? "var(--accent-primary)" : "var(--border-color)")
              }}
            >
              <Building2 size={14} />
              {INDIAN_CITIES[key].name}
            </button>
          ))}
        </div>

        {/* Legend Overlay */}
        <div style={{ position: 'absolute', bottom: '24px', left: '14px', zIndex: 1000, background: 'rgba(10, 16, 32, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '99px', display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-danger)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-danger)' }} /> Critical
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-warning)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-warning)' }} /> Moderate
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-success)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)' }} /> Resolved
          </span>
        </div>

        {/* Floating Manual Form */}
        {showAddForm && clickCoords && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--accent-primary)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1.25rem',
            zIndex: 2000,
            width: '320px',
            boxShadow: 'var(--shadow-lg)',
            backdropFilter: 'blur(20px)'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-display)', color: '#fff' }}>
              <Plus size={16} style={{ color: 'var(--accent-secondary)' }} /> Flag Road Defect Here
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Coords: {clickCoords.lat.toFixed(4)}, {clickCoords.lng.toFixed(4)}
            </p>
            <form onSubmit={handleManualFlagSubmit}>
              <div style={{ marginBottom: '0.65rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Defect Category</label>
                <select className="form-input" value={newIssueCategory} onChange={(e) => setNewIssueCategory(e.target.value)} style={{ padding: '0.4rem' }}>
                  <option value="Pothole">Critical Pothole</option>
                  <option value="Unmarked Speed Breaker">Unmarked Speed Breaker</option>
                  <option value="Monsoon Waterlogged Pit">Monsoon Waterlogged Pit</option>
                  <option value="Open Manhole">Open Manhole</option>
                </select>
              </div>

              <div style={{ marginBottom: '0.65rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Severity</label>
                <select className="form-input" value={newIssueSeverity} onChange={(e) => setNewIssueSeverity(e.target.value)} style={{ padding: '0.4rem' }}>
                  <option value="Critical">🔴 Critical (Danger to 2-Wheelers/Cars)</option>
                  <option value="Moderate">🟡 Moderate</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Description</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Deep crater near Silk Board exit" 
                  value={newIssueDesc} 
                  onChange={(e) => setNewIssueDesc(e.target.value)}
                  style={{ padding: '0.4rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flexGrow: 1, padding: '0.45rem' }}>Flag to Ward</button>
                <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)} style={{ flexGrow: 1, padding: '0.45rem' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Right Sidebar: Smart Routing Avoidance Panel */}
      <div className="glass-card flex flex-col" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
        <h3 className="font-bold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', margin: 0, paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Route size={20} style={{ color: 'var(--accent-secondary)' }} />
          Road-Following Smart Navigation
        </h3>

        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Real road geometry navigation for {currentCity.name}.
          </p>
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.82rem' }}>
            <div><strong>Distance:</strong> {routeStats.distanceKm} km</div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
              <strong>Est Drive Time:</strong> {routeStats.durationMins} mins {isLoadingRoute ? "(Updating geometry...)" : ""}
            </div>
          </div>
        </div>

        {/* Route Selector Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div 
            onClick={() => {
              setSelectedRoute("direct");
              soundFx.playClick();
            }}
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--border-radius-sm)',
              border: '1px solid ' + (selectedRoute === 'direct' ? 'var(--color-danger)' : 'rgba(255,255,255,0.08)'),
              background: selectedRoute === 'direct' ? 'rgba(255, 51, 102, 0.12)' : 'rgba(255,255,255,0.02)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: '700', fontSize: '0.85rem', color: selectedRoute === 'direct' ? 'var(--color-danger)' : '#fff' }}>Direct Road Route</span>
              <span className="badge badge-critical">Potholes Reported</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
              Passes through main bottleneck corridors. 2 active potholes reported. High suspension damage risk.
            </p>
          </div>

          <div 
            onClick={() => {
              setSelectedRoute("alternate");
              soundFx.playClick();
            }}
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--border-radius-sm)',
              border: '1px solid ' + (selectedRoute === 'alternate' ? 'var(--color-success)' : 'rgba(255,255,255,0.08)'),
              background: selectedRoute === 'alternate' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.02)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: '700', fontSize: '0.85rem', color: selectedRoute === 'alternate' ? 'var(--color-success)' : '#fff' }}>Smooth Alternate Bypass</span>
              <span className="badge badge-resolved">0 Potholes • Recommended</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
              Detours via smooth flyover corridors. 0 potholes detected. Smooth road quality index (98%).
            </p>
          </div>
        </div>

        {/* Google Maps Turn-by-Turn Button */}
        <button 
          className="btn-primary" 
          onClick={launchGoogleMapsNavigation}
          style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: 'auto' }}
        >
          <ExternalLink size={16} /> Launch in Google Maps Navigation
        </button>

      </div>
    </div>
  );
}
