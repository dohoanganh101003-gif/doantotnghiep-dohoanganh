export function khoiTaoBanDo() {
  const map = L.map("map").setView([21.03, 105.85], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  return map;
}
