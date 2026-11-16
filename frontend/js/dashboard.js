const isDemoLoggedIn = sessionStorage.getItem("chat-demo-auth") === "true";

if (!isDemoLoggedIn) {
    window.location.replace("login.html");
} else {
    document.querySelector("#user-name").textContent =
        sessionStorage.getItem("chat-demo-name") || "Pengguna";
}

document.querySelector("#logout-button").addEventListener("click", () => {
    sessionStorage.removeItem("chat-demo-auth");
    sessionStorage.removeItem("chat-demo-name");
    window.location.assign("login.html");
});
