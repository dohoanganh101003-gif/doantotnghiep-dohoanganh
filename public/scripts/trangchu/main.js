import { khoiTaoBanDo } from "./banDo.js";
import { taoLayer, taoLegend } from "./lopBanDo.js";
import { ganSuKienBanDo } from "./suKienBanDo.js";
import { khoiTaoTimKiem } from "./timKiem.js";
import { khoiTaoThongKe } from "./thongKe.js";
import { initGiaoDien } from "./giaoDien.js";

document.addEventListener("DOMContentLoaded", () => {
  const { map, baseMaps } = khoiTaoBanDo();

  const { wmsLayer, polygonLayer } = taoLayer(map, baseMaps);

  const { clearHighlight } = ganSuKienBanDo(map);

  taoLegend(map);

  khoiTaoTimKiem(map, clearHighlight);

  khoiTaoThongKe();

  initGiaoDien(map, wmsLayer, polygonLayer);
});
