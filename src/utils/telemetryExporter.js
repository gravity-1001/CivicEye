/**
 * CivicEye Telemetry Exporter Utility
 * Formats road defect telemetry for municipal engineers & GIS mapping (BBMP / MCGM / PWD)
 */

export const exportToCSV = (issues) => {
  const headers = ["ID", "Category", "Severity", "Status", "City", "Address", "Latitude", "Longitude", "Timestamp", "EstRepairCost"];
  const rows = issues.map(i => [
    i.id,
    `"${i.category}"`,
    i.severity,
    i.status,
    i.city,
    `"${i.address.replace(/"/g, '""')}"`,
    i.latitude,
    i.longitude,
    i.timestamp,
    `"${i.estRepairCost || ''}"`
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `civiceye_road_hazards_${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToGeoJSON = (issues) => {
  const geojson = {
    type: "FeatureCollection",
    features: issues.map(i => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [i.longitude, i.latitude]
      },
      properties: {
        id: i.id,
        category: i.category,
        severity: i.severity,
        status: i.status,
        address: i.address,
        authority: i.authority || "BBMP Roads Dept",
        timestamp: i.timestamp
      }
    }))
  };

  const jsonString = JSON.stringify(geojson, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `civiceye_gis_export_${Date.now()}.geojson`;
  link.click();
  URL.revokeObjectURL(url);
};
