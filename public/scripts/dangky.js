document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, phone, password }),
      });

      const text = await res.text();
      alert(text);

      if (res.ok) {
        window.location.href = "/dangnhap";
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi đăng ký");
    }
  });
