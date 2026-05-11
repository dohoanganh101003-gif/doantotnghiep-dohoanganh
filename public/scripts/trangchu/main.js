import { khoiTaoBanDo } from "./banDo.js";
import { taoLayer } from "./lopBanDo.js";
import { ganSuKienBanDo } from "./suKienBanDo.js";
import { khoiTaoTimKiem } from "./timKiem.js";
import { khoiTaoThongKe } from "./thongKe.js";
import { initGiaoDien } from "./giaoDien.js";

document.addEventListener("DOMContentLoaded", () => {
  const map = khoiTaoBanDo();

  const { wmsLayer, polygonLayer } = taoLayer(map);

  ganSuKienBanDo(map);

  khoiTaoTimKiem(map);

  khoiTaoThongKe();

  initGiaoDien(map, wmsLayer, polygonLayer);
});
