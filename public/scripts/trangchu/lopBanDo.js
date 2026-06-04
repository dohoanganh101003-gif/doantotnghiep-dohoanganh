export function taoLayer(map, baseMaps) {
  const wmsLayer = L.tileLayer
    .wms("http://localhost:8080/geoserver/nhamay/wms", {
      layers: "nhamay:nhamay_dien",
      styles: "nhamay_style",
      format: "image/png",
      transparent: true,
    })
    .addTo(map);

  const polygonLayer = L.tileLayer
    .wms("http://localhost:8080/geoserver/nhamay/wms", {
      layers: "nhamay:nhamay_polygon",
      styles: "nhamay_style_polygon",
      format: "image/png",
      transparent: true,
    })
    .addTo(map);

  const overlayMaps = {
    "Nhà máy điện (điểm)": wmsLayer,
    "Vùng nhà máy (polygon)": polygonLayer,
  };

  L.control.layers(baseMaps, overlayMaps).addTo(map);
  return { wmsLayer, polygonLayer };
}

export function taoLegend(map) {
  const legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    const div = L.DomUtil.create("div", "legend-wrapper");

    div.innerHTML = `
      <button class="legend-icon-btn" title="Chú thích">
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="5" r="3" fill="#1E90FF"/>
          <line x1="9" y1="5" x2="19" y2="5" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="4" cy="11" r="3" fill="#ffa500"/>
          <line x1="9" y1="11" x2="19" y2="11" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="4" cy="17" r="3" fill="#808080"/>
          <line x1="9" y1="17" x2="19" y2="17" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>

      <div class="legend-popup hidden">
        <div class="legend-title">Trạng thái nhà máy</div>
        <div class="legend-item">
          <span class="legend-dot" style="background:#1E90FF"></span> Hoạt động
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background:#FF0000"></span> Bảo trì
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background:#808080"></span> Ngừng
        </div>

        <div class="legend-divider"></div>

        <div class="legend-title">Công suất (MW)</div>
        <div class="legend-item">
          <span class="legend-dot" style="background:#00ff00; border:1px solid #ccc"></span> &lt; 50 MW
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background:#ffa500"></span> 50 – 100 MW
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background:#ff0000"></span> &gt; 100 MW
        </div>
      </div>
    `;

    L.DomEvent.disableClickPropagation(div);

    const btn = div.querySelector(".legend-icon-btn");
    const popup = div.querySelector(".legend-popup");

    btn.addEventListener("click", () => {
      popup.classList.toggle("hidden");
    });

    return div;
  };

  legend.addTo(map);
  return legend;
}
