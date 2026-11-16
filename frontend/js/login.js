import { loadDatabase, normalizeEmail } from "./dashboard/storage.js";

const form = document.querySelector(".login-form");
const authMessage = document.querySelector("#auth-message");

if (new URLSearchParams(window.location.search).get("verified") === "1") {
    authMessage.textContent = "Nomor WhatsApp berhasil diverifikasi. Silakan login.";
    authMessage.classList.add("auth-message--success");
    authMessage.hidden = false;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let database;
    try {
        database = loadDatabase();
    } catch (error) {
        authMessage.textContent = error.message;
        authMessage.classList.remove("auth-message--success");
        authMessage.hidden = false;
        return;
    }

    const name = form.elements.name.value.trim();
    const email = normalizeEmail(form.elements.email.value);
    const account = database.accounts[email];

    if (!account || !account.profile.verifiedAt || name !== account.profile.name) {
        authMessage.textContent = "Nama atau email tidak sesuai dengan akun yang sudah terdaftar dan diverifikasi.";
        authMessage.classList.remove("auth-message--success");
        authMessage.hidden = false;
        return;
    }

    sessionStorage.setItem("chat-demo-name", account.profile.name);
    sessionStorage.setItem("chat-demo-user-email", email);
    sessionStorage.setItem("chat-demo-auth", "true");
    sessionStorage.removeItem("chat-demo-phone-verified");
    window.location.assign("dashboard.html");
});
