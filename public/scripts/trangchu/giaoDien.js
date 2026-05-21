export function initGiaoDien(map, wmsLayer, polygonLayer) {
  const toggleBtn = document.getElementById("toggleBtn");
  const sidebar = document.getElementById("sidebar");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");

    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  });

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
  map.on("overlayadd", (e) => {
    if (e.layer === wmsLayer) togglePoint.checked = true;
    if (e.layer === polygonLayer) togglePolygon.checked = true;
  });

  map.on("overlayremove", (e) => {
    if (e.layer === wmsLayer) togglePoint.checked = false;
    if (e.layer === polygonLayer) togglePolygon.checked = false;
  });
}
