document.addEventListener("DOMContentLoaded", function () {
  const map = L.map("map").setView([21.03, 105.85], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);
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
  window.resetMap = function () {
    map.setView([21.03, 105.85], 13);
    if (window.searchLayer) {
      map.removeLayer(window.searchLayer);
    }
  };

  let highlightLayer = null;

  map.on("click", function (e) {
    const latlng = e.latlng;

    const bbox = map.getBounds().toBBoxString();
    const size = map.getSize();
    const point = map.latLngToContainerPoint(latlng);

    const url =
      "/api/geoserver?" +
      "service=WMS" +
      "&version=1.1.1" +
      "&request=GetFeatureInfo" +
      "&layers=nhamay:nhamay_dien,nhamay:nhamay_polygon" +
      "&query_layers=nhamay:nhamay_dien,nhamay:nhamay_polygon" +
      "&bbox=" +
      bbox +
      "&feature_count=1" +
      "&height=" +
      size.y +
      "&width=" +
      size.x +
      "&info_format=application/json" +
      "&srs=EPSG:4326" +
      "&x=" +
      Math.floor(point.x) +
      "&y=" +
      Math.floor(point.y);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!data.features || data.features.length === 0) return;

        const feature = data.features[0];
        const f = feature.properties;

        if (highlightLayer) {
          map.removeLayer(highlightLayer);
        }

        highlightLayer = L.geoJSON(feature, {
          style: {
            color: "yellow",
            weight: 3,
            fillOpacity: 0.3,
          },
        }).addTo(map);
        map.fitBounds(highlightLayer.getBounds());

        const statusClass = f.trang_thai.toLowerCase().replace(/\s+/g, "-");
        // 🔥 popup
        const popupContent = `
          <div class="popup-card">
            <div class="popup-header">
              ${f.ten_nha_may}
            </div>

            <div class="popup-body">
              ${
                f.image
                  ? `
                <div class="popup-image">
                  <img src="http://localhost:3004${f.image}" alt="Ảnh nhà máy">
                </div>
              `
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

        L.popup({
          className: "custom-popup",
          maxWidth: 250,
        })
          .setLatLng(latlng)
          .setContent(popupContent)
          .openOn(map);
      })
      .catch((err) => console.error("GetFeatureInfo lỗi:", err));
  });

  map.on("mousemove", function (e) {
    const latlng = e.latlng;

    const bbox = map.getBounds().toBBoxString();
    const size = map.getSize();
    const point = map.latLngToContainerPoint(latlng);

    const url =
      "/api/geoserver?" +
      "service=WMS" +
      "&version=1.1.1" +
      "&request=GetFeatureInfo" +
      "&layers=nhamay:nhamay_dien,nhamay:nhamay_polygon" +
      "&query_layers=nhamay:nhamay_dien,nhamay:nhamay_polygon" +
      "&bbox=" +
      bbox +
      "&feature_count=1" +
      "&height=" +
      size.y +
      "&width=" +
      size.x +
      "&info_format=application/json" +
      "&srs=EPSG:4326" +
      "&x=" +
      Math.floor(point.x) +
      "&y=" +
      Math.floor(point.y);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!data.features || data.features.length === 0) {
          map.getContainer().title = "";
          return;
        }

        const f = data.features[0].properties;

        // tooltip browser
        map.getContainer().title = f.ten_nha_may + " - " + f.trang_thai;
      })
      .catch(() => {});
  });

  window.addPlant = function () {
    const name = document.getElementById("name").value;
    const province = document.getElementById("province").value;
    const capacity = document.getElementById("capacity").value;
    const lat = document.getElementById("lat").value;
    const lng = document.getElementById("lng").value;

    if (!name || !capacity || !lat || !lng) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    fetch("/api/solar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ten_nha_may: name,
        cong_suat: capacity,
        trang_thai: province,
        lat,
        lng,
      }),
    })
      .then((res) => res.text())
      .then((data) => {
        alert(data);

        wmsLayer.setParams({
          _t: Date.now(),
        });
        polygonLayer.setParams({
          _t: Date.now(),
        });

        // reset form
        document.getElementById("name").value = "";
        document.getElementById("province").value = "";
        document.getElementById("capacity").value = "";
        document.getElementById("lat").value = "";
        document.getElementById("lng").value = "";
      })
      .catch((err) => {
        console.error(err);
        alert("Lỗi khi thêm dữ liệu");
      });
  };

  const toggleBtn = document.getElementById("toggleBtn");
  const sidebar = document.getElementById("sidebar");
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  });
  let statsLoaded = false;

  function toggleStats() {
    const panel = document.getElementById("statsPanel");
    panel.classList.toggle("hidden");
    if (!statsLoaded) {
      loadStats();
      statsLoaded = true;
    }
  }

  async function loadStats() {
    const res = await fetch("/api/stats");
    const data = await res.json();
    const stats = data.stats;
    const regionStats = data.regionStats;

    new Chart(document.getElementById("statusChart"), {
      type: "pie",
      data: {
        labels: ["Hoạt động", "Bảo trì", "Ngừng"],
        datasets: [
          {
            data: [stats.hoat_dong, stats.bao_tri, stats.ngung],
          },
        ],
      },
    });

    new Chart(document.getElementById("regionChart"), {
      type: "doughnut",
      data: {
        labels: regionStats.map((r) => r.khu_vuc),
        datasets: [
          {
            data: regionStats.map((r) => r.count),
          },
        ],
      },
    });
  }

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

  window.searchPlant = function () {
    const keyword = document.getElementById("search").value;

    if (!keyword) {
      alert("Nhập từ khóa!");
      return;
    }

    fetch(`/api/search?keyword=${keyword}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
          alert("Không tìm thấy!");
          return;
        }

        if (window.searchLayer) {
          map.removeLayer(window.searchLayer);
        }

        window.searchLayer = L.layerGroup();

        data.forEach((item) => {
          const marker = L.marker([item.lat, item.lng]).bindPopup(
            `<b>${item.ten_nha_may}</b>`,
          );
          window.searchLayer.addLayer(marker);
        });

        window.searchLayer.addTo(map);

        const group = new L.featureGroup(window.searchLayer.getLayers());
        map.fitBounds(group.getBounds());
      })
      .catch((err) => {
        console.error(err);
        alert("Lỗi tìm kiếm");
      });
  };
});
