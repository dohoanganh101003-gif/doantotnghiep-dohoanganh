import { fetchFeatureInfo } from "./api.js";

export function ganSuKienBanDo(map) {
  let highlightLayer = null;

  function buildUrl(latlng) {
    const bbox = map.getBounds().toBBoxString();
    const size = map.getSize();
    const point = map.latLngToContainerPoint(latlng);

    return (
      `/api/geoserver?service=WMS&version=1.1.1&request=GetFeatureInfo` +
      `&layers=nhamay:nhamay_dien,nhamay:nhamay_polygon` +
      `&query_layers=nhamay:nhamay_dien,nhamay:nhamay_polygon` +
      `&bbox=${bbox}&feature_count=1&height=${size.y}&width=${size.x}` +
      `&info_format=application/json&srs=EPSG:4326` +
      `&x=${Math.floor(point.x)}&y=${Math.floor(point.y)}`
    );
  }

  // CLICK
  map.on("click", async (e) => {
    const data = await fetchFeatureInfo(buildUrl(e.latlng));
    if (!data.features?.length) return;

    const feature = data.features[0];
    const f = feature.properties;

    if (highlightLayer) map.removeLayer(highlightLayer);

    highlightLayer = L.geoJSON(feature, {
      style: { color: "yellow", weight: 3, fillOpacity: 0.3 },
    }).addTo(map);

    map.fitBounds(highlightLayer.getBounds());

    const statusClass = f.trang_thai.toLowerCase().replace(/\s+/g, "-");

    const popup = `
      <div class="popup-card">
        <div class="popup-header">${f.ten_nha_may}</div>
        <div class="popup-body">
          ${
            f.image
              ? `
            <div class="popup-image">
              <img src="http://localhost:3004${f.image}">
            </div>`
              : ""
          }
          <div class="popup-row">
            <span>🏭 Công suất:</span>
            <b>${f.cong_suat} MW</b>
          </div>
          <div class="popup-row">
            <span>📍 Trạng thái:</span>
            <b class="status ${statusClass}">${f.trang_thai}</b>
          </div>
        </div>
      </div>
    `;

    L.popup({ className: "custom-popup" })
      .setLatLng(e.latlng)
      .setContent(popup)
      .openOn(map);
  });

  // HOVER
  map.on("mousemove", async (e) => {
    const data = await fetchFeatureInfo(buildUrl(e.latlng));

    if (!data.features?.length) {
      map.getContainer().title = "";
      return;
    }

    const f = data.features[0].properties;
    map.getContainer().title = `${f.ten_nha_may} - ${f.trang_thai}`;
  });
}
