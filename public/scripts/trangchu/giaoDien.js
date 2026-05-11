export function initGiaoDien(map, wmsLayer, polygonLayer) {
  // ===== SIDEBAR =====
  const toggleBtn = document.getElementById("toggleBtn");
  const sidebar = document.getElementById("sidebar");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");

    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  });

  // ===== TOGGLE LAYER =====
  const togglePoint = document.getElementById("togglePoint");
  const togglePolygon = document.getElementById("togglePolygon");

  togglePoint.addEventListener("change", function () {
    if (this.checked) {
      map.addLayer(wmsLayer);
    } else {
      map.removeLayer(wmsLayer);
    }
  });

  togglePolygon.addEventListener("change", function () {
    if (this.checked) {
      map.addLayer(polygonLayer);
    } else {
      map.removeLayer(polygonLayer);
    }
  });
}
