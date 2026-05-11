import { fetchSearch } from "./api.js";

export function khoiTaoTimKiem(map) {
  const input = document.getElementById("search");
  const btnSearch = document.getElementById("btnSearch");
  const btnReset = document.getElementById("btnReset");

  let searchLayer = null;

  // ===== HÀM RENDER KẾT QUẢ =====
  function renderResults(data) {
    // xoá layer cũ
    if (searchLayer) {
      map.removeLayer(searchLayer);
    }

    searchLayer = L.layerGroup();

    data.forEach((item) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lng);

      if (isNaN(lat) || isNaN(lng)) return;

      const marker = L.marker([lat, lng]).bindPopup(
        `<b>${item.ten_nha_may}</b>`,
      );

      searchLayer.addLayer(marker);
    });

    const layers = searchLayer.getLayers();

    if (layers.length === 0) {
      alert("Không có dữ liệu hợp lệ!");
      return;
    }

    searchLayer.addTo(map);

    const group = L.featureGroup(layers);
    map.fitBounds(group.getBounds());
  }

  // ===== XỬ LÝ TÌM KIẾM =====
  async function handleSearch() {
    const keyword = input.value.trim();

    if (!keyword) {
      alert("Nhập từ khóa!");
      return;
    }

    try {
      const data = await fetchSearch(keyword);

      if (!data || data.length === 0) {
        alert("Không tìm thấy!");
        return;
      }

      renderResults(data);
    } catch (err) {
      console.error("SEARCH ERROR:", err);
      alert(err.message || "Lỗi tìm kiếm");
    }
  }

  // ===== RESET =====
  function handleReset() {
    map.setView([21.03, 105.85], 13);

    if (searchLayer) {
      map.removeLayer(searchLayer);
      searchLayer = null;
    }

    input.value = "";
  }

  // ===== EVENT =====
  btnSearch.addEventListener("click", handleSearch);
  btnReset.addEventListener("click", handleReset);

  // Enter để tìm
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });
}
