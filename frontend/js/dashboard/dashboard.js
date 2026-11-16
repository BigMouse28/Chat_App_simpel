import { initializeChat } from "./chat.js";
import { initializeContacts } from "./contacts.js";
import { initializeProfile } from "./profile.js";
import { loadState } from "./storage.js";

const isLoggedIn = sessionStorage.getItem("chat-demo-auth") === "true";
if (!isLoggedIn) {
    window.location.replace("login.html");
} else {
    const main = document.querySelector(".dashboard");
    const alert = document.createElement("p");
    alert.className = "dashboard-alert";
    alert.setAttribute("role", "alert");
    alert.hidden = true;
    document.body.prepend(alert);

    function showAlert(message) {
        alert.textContent = message;
        alert.hidden = !message;
    }

    document.querySelector("#logout-button").addEventListener("click", () => {
        sessionStorage.removeItem("chat-demo-auth");
        sessionStorage.removeItem("chat-demo-name");
        window.location.assign("login.html");
    });

    document.querySelectorAll("[data-close-dialog]").forEach((button) => {
        button.addEventListener("click", () => button.closest("dialog").close());
    });

    try {
        const state = loadState({
            name: sessionStorage.getItem("chat-demo-verified-name") || sessionStorage.getItem("chat-demo-name") || "Pengguna",
            email: sessionStorage.getItem("chat-demo-verified-email") || "",
            phone: sessionStorage.getItem("chat-demo-verified-phone") || ""
        });

        let chat;
        const contacts = initializeContacts(
            state,
            (contactId) => {
                chat?.render(contactId);
                contacts.render(contactId);
            },
            showAlert
        );
        chat = initializeChat(state, (contactId) => contacts.openEdit(contactId), showAlert);
        initializeProfile(state, showAlert);
        contacts.render();
    } catch (error) {
        main.hidden = true;
        showAlert(error.message || "Dashboard tidak dapat dimuat.");
    }
}
