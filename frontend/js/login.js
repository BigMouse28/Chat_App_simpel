const form = document.querySelector(".login-form");
const authMessage = document.querySelector("#auth-message");
const isPhoneVerified = sessionStorage.getItem("chat-demo-phone-verified") === "true";

if (isPhoneVerified) {
    form.elements.name.value = sessionStorage.getItem("chat-demo-verified-name") || "";
    form.elements.email.value = sessionStorage.getItem("chat-demo-verified-email") || "";
}

if (new URLSearchParams(window.location.search).get("verified") === "1") {
    authMessage.textContent = "Nomor WhatsApp berhasil diverifikasi. Silakan login.";
    authMessage.classList.add("auth-message--success");
    authMessage.hidden = false;
} else if (!isPhoneVerified) {
    authMessage.textContent = "Selesaikan registrasi dan verifikasi nomor terlebih dahulu sebelum login.";
    authMessage.hidden = false;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (sessionStorage.getItem("chat-demo-phone-verified") !== "true") {
        authMessage.textContent = "Nomor belum diverifikasi. Selesaikan verifikasi OTP terlebih dahulu.";
        authMessage.classList.remove("auth-message--success");
        authMessage.hidden = false;
        return;
    }

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim().toLocaleLowerCase();
    const verifiedName = (sessionStorage.getItem("chat-demo-verified-name") || "").trim();
    const verifiedEmail = (sessionStorage.getItem("chat-demo-verified-email") || "").trim().toLocaleLowerCase();

    if (name !== verifiedName || email !== verifiedEmail) {
        authMessage.textContent = "Nama atau email tidak sesuai dengan akun demo yang sudah diverifikasi.";
        authMessage.classList.remove("auth-message--success");
        authMessage.hidden = false;
        return;
    }

    sessionStorage.setItem("chat-demo-name", name);
    sessionStorage.setItem("chat-demo-auth", "true");
    window.location.assign("dashboard.html");
});
