import { fetchFeatureInfo } from "./api.js";

export function ganSuKienBanDo(map) {
  let highlightLayer = null;
  let hoverTimeout = null;

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

  function tinhThoiGian(ngay_hoat_dong) {
    if (!ngay_hoat_dong) return "Chưa cập nhật";
    const ms = Date.now() - new Date(ngay_hoat_dong);
    const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(
      (ms % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30),
    );
    return (years > 0 ? years + " năm " : "") + months + " tháng";
  }

  function buildPopup(f) {
    const statusClass = (f.trang_thai || "").toLowerCase().replace(/\s+/g, "-");

    return `
      <div class="popup-card">
 
        <div class="popup-header">${f.ten_nha_may || "Không rõ"}</div>
 
        ${
          f.image
            ? `
          <div class="popup-image">
            <img src="http://localhost:3004${f.image}" alt="${f.ten_nha_may}">
          </div>`
            : ""
        }
 
        <div class="popup-body">
 
          <div class="popup-row">
            <span>🏭 Công suất</span>
            <b>${f.cong_suat ?? "N/A"} MW</b>
          </div>
 
          <div class="popup-row">
            <span>📍 Trạng thái</span>
            <span class="status ${statusClass}">${f.trang_thai || "N/A"}</span>
          </div>
 
          <div class="popup-row">
            <span>⏱ Thời gian HĐ</span>
            <b>${tinhThoiGian(f.ngay_hoat_dong)}</b>
          </div>
 
        </div>
      </div>
    `;
  }

  map.on("click", async (e) => {
    try {
      const data = await fetchFeatureInfo(buildUrl(e.latlng));
      if (!data.features?.length) return;

      const feature = data.features[0];
      const f = feature.properties;

      if (highlightLayer) map.removeLayer(highlightLayer);

      highlightLayer = L.geoJSON(feature, {
        style: { color: "#3b82f6", weight: 3, fillOpacity: 0.15 },
      }).addTo(map);

      map.fitBounds(highlightLayer.getBounds());

      L.popup({ className: "custom-popup", maxHeight: 400 })
        .setLatLng(e.latlng)
        .setContent(buildPopup(f))
        .openOn(map);
    } catch (err) {
      console.error("Lỗi click bản đồ:", err);
    }
  });

  map.on("mousemove", (e) => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(async () => {
      try {
        const data = await fetchFeatureInfo(buildUrl(e.latlng));
        if (!data.features?.length) {
          map.getContainer().title = "";
          return;
        }
        const f = data.features[0].properties;
        map.getContainer().title = `${f.ten_nha_may} — ${f.trang_thai}`;
      } catch (_) {}
    }, 300);
  });
  return {
    clearHighlight: () => {
      if (highlightLayer) {
        map.removeLayer(highlightLayer);
        highlightLayer = null;
      }
      map.closePopup(); // đóng popup nếu đang mở
    },
  };
}
