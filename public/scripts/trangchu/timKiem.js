import { fetchSearch } from "./api.js";

export function khoiTaoTimKiem(map, clearHighlight) {
  // ✅ nhận thêm tham số
  const input = document.getElementById("search");
  const btnSearch = document.getElementById("btnSearch");
  const btnReset = document.getElementById("btnReset");

  let searchLayer = null;

  function renderResults(data) {
    if (searchLayer) map.removeLayer(searchLayer);

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
    map.fitBounds(L.featureGroup(layers).getBounds());
  }

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

  function handleReset() {
    // ✅ Xoá marker tìm kiếm
    if (searchLayer) {
      map.removeLayer(searchLayer);
      searchLayer = null;
    }

    // ✅ Xoá highlight + đóng popup
    if (clearHighlight) clearHighlight();

    input.value = "";
    map.setView([21.03, 105.85], 13);
  }

  btnSearch.addEventListener("click", handleSearch);
  btnReset.addEventListener("click", handleReset);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });
}
