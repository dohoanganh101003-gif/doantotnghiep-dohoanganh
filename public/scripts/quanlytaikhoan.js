function openModal() {
  document.getElementById("modalOverlay").classList.add("active");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("active");
  // Reset form
  ["new-username", "new-email", "new-phone", "new-password"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.getElementById("new-role").value = "user";
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById("modalOverlay")) closeModal();
}

function showToast(message, type) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast " + type;
  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

async function submitCreateUser() {
  const btn = document.getElementById("submitBtn");
  const data = {
    username: document.getElementById("new-username").value.trim(),
    email: document.getElementById("new-email").value.trim(),
    phone: document.getElementById("new-phone").value.trim(),
    password: document.getElementById("new-password").value,
    role: document.getElementById("new-role").value,
  };

  if (!data.username || !data.email || !data.phone || !data.password) {
    showToast("Vui lòng nhập đầy đủ thông tin!", "error");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Đang tạo...";

  try {
    const res = await fetch("/auth/admin/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      showToast(result.success, "success");
      closeModal();
      setTimeout(() => location.reload(), 1200);
    } else {
      showToast(result.error || "Lỗi tạo tài khoản", "error");
    }
  } catch (err) {
    showToast("Lỗi kết nối server", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Tạo tài khoản";
  }
}
