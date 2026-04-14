document.addEventListener("DOMContentLoaded", function () {
  const map = L.map("map").setView([21.03, 105.85], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  let marker;

  map.on("click", function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    console.log("Clicked:", lat, lng); // 👈 THÊM DÒNG NÀY

    document.getElementById("lat").value = lat.toFixed(6);
    document.getElementById("lng").value = lng.toFixed(6);

    if (marker) {
      marker.setLatLng(e.latlng);
    } else {
      marker = L.marker(e.latlng).addTo(map);
    }
  });

  const form = document.getElementById("formAdd");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const lat = document.getElementById("lat").value;
    const lng = document.getElementById("lng").value;

    console.log("LAT:", lat);
    console.log("LNG:", lng);

    if (!lat || !lng) {
      alert("Vui lòng click vào bản đồ để chọn vị trí!");
      return;
    }

    const formData = new FormData(form);

    fetch("/api/solar", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.text())
      .then((msg) => {
        alert(msg);
        window.location.href = "/nhamay";
      })
      .catch((err) => {
        console.error(err);
        alert("Lỗi thêm nhà máy");
      });
  });

  // preview ảnh
  document.getElementById("image").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const preview = document.getElementById("preview");
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  });
});
