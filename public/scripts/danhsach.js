function xoa(id) {
  if (!confirm("Bạn có chắc muốn xoá?")) return;

  fetch("/api/solar/" + id, {
    method: "DELETE",
  })
    .then((res) => res.text())
    .then((data) => {
      alert(data);
      location.reload();
    })
    .catch((err) => {
      console.error(err);
      alert("Lỗi xoá");
    });
}
