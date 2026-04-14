document
  .getElementById("registerAdminForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      password: document.getElementById("password").value,
    };

    fetch("/auth/register-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.text())
      .then((msg) => {
        alert(msg);
        window.location.href = "/";
      })
      .catch((err) => {
        console.error(err);
        alert("Lỗi");
      });
  });
