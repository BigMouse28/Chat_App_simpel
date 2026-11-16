import { createId, findAccountByPhone, loadDatabase, normalizeEmail, saveDatabase } from "./dashboard/storage.js";

const form = document.querySelector(".verification-form");
const otpInput = document.querySelector("#otp");
const otpError = document.querySelector("#otp-error");
const otpNotification = document.querySelector("#otp-notification");
const pendingPhone = sessionStorage.getItem("chat-demo-pending-phone");

if (!pendingPhone) {
    window.location.replace("registrasi.html");
} else {
    document.querySelector("#phone-number").textContent = pendingPhone;
    otpNotification.hidden = false;
}

document.querySelector("#close-notification").addEventListener("click", () => {
    otpNotification.hidden = true;
});

otpInput.addEventListener("input", () => {
    otpInput.value = otpInput.value.replace(/\D/g, "").slice(0, 6);
    otpInput.removeAttribute("aria-invalid");
    otpError.textContent = "";
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!pendingPhone) {
        window.location.replace("registrasi.html");
        return;
    }

    if (otpInput.value !== "123456") {
        otpInput.setAttribute("aria-invalid", "true");
        otpError.textContent = "Kode OTP tidak sesuai. Periksa kembali kode demo.";
        otpInput.focus();
        return;
    }

    const name = sessionStorage.getItem("chat-demo-pending-name") || "";
    const email = normalizeEmail(sessionStorage.getItem("chat-demo-pending-email") || "");
    let database;
    try {
        database = loadDatabase();
    } catch (error) {
        otpError.textContent = error.message;
        return;
    }

    if (database.accounts[email]) {
        otpError.textContent = "Alamat email ini sudah terdaftar. Silakan masuk dengan akun tersebut.";
        return;
    }

    if (findAccountByPhone(database, pendingPhone)) {
        otpError.textContent = "Nomor telepon ini sudah terdaftar pada akun lain.";
        return;
    }

    database.accounts[email] = {
        profile: {
            id: createId(),
            name,
            email,
            phone: pendingPhone,
            verifiedAt: new Date().toISOString(),
            status: "Aktif",
            bio: "",
            avatar: ""
        },
        contacts: []
    };

    try {
        saveDatabase(database);
    } catch (error) {
        otpError.textContent = error.message;
        return;
    }

    sessionStorage.setItem("chat-demo-verified-name", name);
    sessionStorage.setItem("chat-demo-verified-email", email);
    sessionStorage.setItem("chat-demo-verified-phone", pendingPhone);
    sessionStorage.setItem("chat-demo-phone-verified", "true");
    sessionStorage.removeItem("chat-demo-pending-name");
    sessionStorage.removeItem("chat-demo-pending-email");
    sessionStorage.removeItem("chat-demo-pending-phone");
    window.location.assign("login.html?verified=1");
});
