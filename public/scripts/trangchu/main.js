import { khoiTaoBanDo } from "./banDo.js";
import { taoLayer } from "./lopBanDo.js";
import { ganSuKienBanDo } from "./suKienBanDo.js";
import { khoiTaoTimKiem } from "./timKiem.js";
import { khoiTaoThongKe } from "./thongKe.js";
import { initGiaoDien } from "./giaoDien.js";

document.addEventListener("DOMContentLoaded", () => {
  const { map, baseMaps } = khoiTaoBanDo(); // ✅ destructure thêm baseMaps

  const { wmsLayer, polygonLayer } = taoLayer(map, baseMaps); // ✅ truyền baseMaps

  const { clearHighlight } = ganSuKienBanDo(map); // ✅ nhận về

  khoiTaoTimKiem(map, clearHighlight); // ✅ truyền vào

  khoiTaoThongKe();

  initGiaoDien(map, wmsLayer, polygonLayer);
});
