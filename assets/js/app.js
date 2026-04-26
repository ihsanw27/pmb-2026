// ==========================================
// MASUKKAN URL API GOOGLE SCRIPT YANG SAMA!
// ==========================================
const API_URL = "https://script.google.com/macros/s/AKfycbzJQjxT6QKsyuNMn4KCxsFuRAD5MPItgHdqPVdAvintroDIf9dAeMxhCWyyaX4LkfeW/exec";

// Allow Enter key to trigger login
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("no-peserta").addEventListener("keydown", function (e) {
    if (e.key === "Enter") loginPeserta();
  });
});

async function loginPeserta() {
  let no = document.getElementById("no-peserta").value.trim();

  if (!no) {
    return Swal.fire("Data Kosong", "Masukkan Nomor Pendaftaran!", "warning");
  }

  if (!/^\d+$/.test(no)) {
    return Swal.fire("Format Salah", "Nomor Pendaftaran hanya boleh berisi angka.", "warning");
  }

  let btn = document.getElementById("btn-login");
  btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Mencari...`;
  btn.disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "loginPeserta", noPeserta: no }),
    });

    let res;
    try {
      res = await response.json();
    } catch (_) {
      throw new Error("Respon server tidak valid.");
    }

    if (res && res.success) {
      document.getElementById("nama-peserta").innerText = res.nama;
      document.getElementById("nomor-peserta").innerText = res.no_peserta;

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(res.no_peserta)}`;
      const qrImage = document.getElementById("qr-image");
      qrImage.src = qrUrl;
      qrImage.alt = `QR Code peserta ${res.no_peserta}`;

      document.getElementById("view-login").classList.add("hidden");
      document.getElementById("view-kartu").classList.remove("hidden");
    } else {
      Swal.fire("Tidak Ditemukan", res.message || "Data tidak ditemukan.", "error");
    }
  } catch (e) {
    Swal.fire("Koneksi Gagal", e.message || "Pastikan internet Anda stabil.", "error");
  } finally {
    btn.innerHTML = `TAMPILKAN QR CODE <i class="bi bi-qr-code ms-1"></i>`;
    btn.disabled = false;
  }
}

function keluar() {
  document.getElementById("no-peserta").value = "";
  document.getElementById("nama-peserta").innerText = "";
  document.getElementById("nomor-peserta").innerText = "";
  const qrImage = document.getElementById("qr-image");
  qrImage.src = "";
  qrImage.alt = "QR Code Peserta";
  document.getElementById("view-kartu").classList.add("hidden");
  document.getElementById("view-login").classList.remove("hidden");
}
