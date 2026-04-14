const stats = window.stats || {};
const regionStats = window.regionStats || [];
const provinceStats = window.provinceStats || [];

new Chart(document.getElementById("statusChart"), {
  type: "pie",
  data: {
    labels: ["Hoạt động", "Bảo trì", "Ngừng"],
    datasets: [
      {
        data: [stats.hoat_dong || 0, stats.bao_tri || 0, stats.ngung || 0],
      },
    ],
  },
});

new Chart(document.getElementById("regionChart"), {
  type: "pie",
  data: {
    labels: regionStats.map((r) => r.khu_vuc || "Chưa xác định"),
    datasets: [
      {
        data: regionStats.map((r) => r.count),
      },
    ],
  },
});

new Chart(document.getElementById("provinceChart"), {
  type: "pie",
  data: {
    labels: provinceStats.map((p) => p.tinh || "Chưa có"),
    datasets: [
      {
        label: "Số nhà máy",
        data: provinceStats.map((p) => p.count),
      },
    ],
  },
});
