const isAdminOrOwner = window.__isAdminOrOwner__;
const logCache = {};

function renderLogs(logs) {
  if (!logs || logs.length === 0) {
    return `<div class="log-empty">Không có lịch sử trong khoảng thời gian này.</div>`;
  }

  const headers = isAdminOrOwner
    ? `<th>Thời gian</th><th>Trạng thái</th><th>Tác vụ</th><th>Ghi chú</th><th>Người thực hiện</th>`
    : `<th>Thời gian</th><th>Trạng thái</th>`;

  const rows = logs
    .map((l) => {
      const trangThaiClass =
        l.trang_thai === "Hoạt động"
          ? "badge-active"
          : l.trang_thai === "Bảo trì"
            ? "badge-maintenance"
            : l.trang_thai === "Ngừng"
              ? "badge-stopped"
              : "";

      const actionClass = (l.action || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");

      const time = new Date(l.created_at).toLocaleString("vi-VN");
      const badge = `<span class="badge ${trangThaiClass}">${l.trang_thai || "—"}</span>`;

      if (isAdminOrOwner) {
        return `<tr>
        <td class="col-time">${time}</td>
        <td>${badge}</td>
        <td><span class="action-tag action-${actionClass}">${l.action || "—"}</span></td>
        <td class="col-note">${l.ghi_chu || "—"}</td>
        <td>${l.username || "—"}</td>
      </tr>`;
      } else {
        return `<tr>
        <td class="col-time">${time}</td>
        <td>${badge}</td>
      </tr>`;
      }
    })
    .join("");

  return `
    <table class="log-table">
      <thead><tr>${headers}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

async function fetchLogs(plantId, tuNgay, denNgay) {
  const cacheKey = `${plantId}|${tuNgay}|${denNgay}`;
  if (logCache[cacheKey]) return logCache[cacheKey];

  let url = `/api/plants/${plantId}/logs/lazy`;
  const params = [];
  if (tuNgay) params.push(`tu_ngay=${tuNgay}`);
  if (denNgay) params.push(`den_ngay=${denNgay}`);
  if (params.length) url += "?" + params.join("&");

  const res = await fetch(url);
  const logs = await res.json();
  logCache[cacheKey] = logs;
  return logs;
}

async function loadAndRender(plantId, tuNgay = "", denNgay = "") {
  const content = document.getElementById(`log-content-${plantId}`);
  content.innerHTML = `<div class="log-loading">Đang tải...</div>`;
  try {
    const logs = await fetchLogs(plantId, tuNgay, denNgay);
    content.innerHTML = renderLogs(logs);
  } catch {
    content.innerHTML = `<div class="log-empty">Lỗi tải dữ liệu.</div>`;
  }
}

// ✅ Gắn sự kiện cho từng hàng nhà máy
document.querySelectorAll(".plant-row").forEach((row) => {
  row.addEventListener("click", async (e) => {
    // Bỏ qua nếu click vào button hoặc input bên trong log-row
    if (e.target.closest(".inner-filter")) return;

    const plantId = row.dataset.id;
    const logRow = document.getElementById(`log-${plantId}`);
    const icon = row.querySelector(".toggle-icon");
    const isOpen = row.dataset.open === "true";

    if (isOpen) {
      // ✅ Đóng
      logRow.style.display = "none";
      row.dataset.open = "false";
      icon.textContent = "▶";
      row.classList.remove("row-active");
    } else {
      // ✅ Mở — load log không có filter thời gian
      logRow.style.display = "table-row";
      row.dataset.open = "true";
      icon.textContent = "▼";
      row.classList.add("row-active");

      await loadAndRender(plantId);
    }
  });
});

// ✅ Nút "Lọc" bên trong từng nhà máy
document.querySelectorAll(".btn-loc").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.stopPropagation(); // không kích hoạt toggle
    const plantId = btn.dataset.id;
    const tuNgay = document.getElementById(`tu_ngay_${plantId}`).value;
    const denNgay = document.getElementById(`den_ngay_${plantId}`).value;
    await loadAndRender(plantId, tuNgay, denNgay);
  });
});

// ✅ Nút "Xoá lọc" — reset về xem toàn bộ
document.querySelectorAll(".btn-xoa-loc").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const plantId = btn.dataset.id;
    document.getElementById(`tu_ngay_${plantId}`).value = "";
    document.getElementById(`den_ngay_${plantId}`).value = "";
    await loadAndRender(plantId);
  });
});
