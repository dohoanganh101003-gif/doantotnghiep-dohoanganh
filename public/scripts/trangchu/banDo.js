export function khoiTaoBanDo() {
  const map = L.map("map").setView([21.03, 105.85], 13);

  const osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "© OpenStreetMap",
    },
  );

  const googleStreet = L.tileLayer(
    "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    { maxZoom: 20, subdomains: ["mt0", "mt1", "mt2", "mt3"] },
  );

  const googleSatellite = L.tileLayer(
    "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    { maxZoom: 20, subdomains: ["mt0", "mt1", "mt2", "mt3"] },
  );

  const darkMap = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    { attribution: "&copy; CartoDB" },
  );

  const esriSatellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { attribution: "Tiles © Esri" },
  );

  osm.addTo(map);

  const baseMaps = {
    OpenStreetMap: osm,
    "Google Street": googleStreet,
    "Google Satellite": googleSatellite,
    "Dark Mode": darkMap,
    "ESRI Satellite": esriSatellite,
  };

  return { map, baseMaps };
}
