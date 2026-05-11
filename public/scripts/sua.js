document.addEventListener("DOMContentLoaded", function () {
  const lat = parseFloat(document.getElementById("lat").value);
  const lng = parseFloat(document.getElementById("lng").value);

  const map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  let marker = L.marker([lat, lng]).addTo(map);

  map.on("click", function (e) {
    const newLat = e.latlng.lat;
    const newLng = e.latlng.lng;

    marker.setLatLng([newLat, newLng]);

    document.getElementById("lat").value = newLat.toFixed(6);
    document.getElementById("lng").value = newLng.toFixed(6);
  });

  document.getElementById("formEdit").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("id").value;

    const formData = new FormData();

    formData.append("ten_nha_may", document.getElementById("name").value);
    formData.append("trang_thai", document.getElementById("status").value);
    formData.append("cong_suat", document.getElementById("capacity").value);
    formData.append("tinh", document.getElementById("tinh").value);
    formData.append("khu_vuc", document.getElementById("khu_vuc").value);
    formData.append("lat", document.getElementById("lat").value);
    formData.append("lng", document.getElementById("lng").value);

    const file = document.getElementById("image").files[0];
    if (file) {
      formData.append("image", file);
    }

    fetch(`/api/plants/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.text())
      .then((msg) => {
        alert(msg);
        window.location.href = "/nhamay";
      })
      .catch((err) => {
        console.error(err);
        alert("Lỗi cập nhật");
      });
  });
  document.getElementById("image").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const preview = document.getElementById("preview");
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  });
});
