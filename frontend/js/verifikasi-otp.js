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

    sessionStorage.setItem("chat-demo-verified-name", sessionStorage.getItem("chat-demo-pending-name") || "");
    sessionStorage.setItem("chat-demo-verified-email", sessionStorage.getItem("chat-demo-pending-email") || "");
    sessionStorage.setItem("chat-demo-verified-phone", pendingPhone);
    sessionStorage.setItem("chat-demo-phone-verified", "true");
    sessionStorage.removeItem("chat-demo-pending-name");
    sessionStorage.removeItem("chat-demo-pending-email");
    sessionStorage.removeItem("chat-demo-pending-phone");
    window.location.assign("login.html?verified=1");
});
