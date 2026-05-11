import { fetchStats } from "./api.js";

export function khoiTaoThongKe() {
  let loaded = false;

  window.toggleStats = async function () {
    const panel = document.getElementById("statsPanel");
    panel.classList.toggle("hidden");

    if (loaded) return;
    loaded = true;

    const data = await fetchStats();

    new Chart(document.getElementById("statusChart"), {
      type: "pie",
      data: {
        labels: ["Hoạt động", "Bảo trì", "Ngừng"],
        datasets: [
          {
            data: [data.stats.hoat_dong, data.stats.bao_tri, data.stats.ngung],
          },
        ],
      },
    });

    new Chart(document.getElementById("regionChart"), {
      type: "doughnut",
      data: {
        labels: data.regionStats.map((r) => r.khu_vuc),
        datasets: [
          {
            data: data.regionStats.map((r) => r.count),
          },
        ],
      },
    });
  };
}
