import { initializeChat } from "./chat.js";
import { initializeContacts } from "./contacts.js";
import { initializeProfile } from "./profile.js";
import { DATABASE_KEY, loadDatabase, normalizeEmail } from "./storage.js";

const isLoggedIn = sessionStorage.getItem("chat-demo-auth") === "true";
const currentEmail = normalizeEmail(sessionStorage.getItem("chat-demo-user-email") || "");

if (!isLoggedIn || !currentEmail) {
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
        sessionStorage.removeItem("chat-demo-user-email");
        sessionStorage.removeItem("chat-demo-phone-verified");
        window.location.assign("login.html");
    });

    document.querySelectorAll("[data-close-dialog]").forEach((button) => {
        button.addEventListener("click", () => button.closest("dialog").close());
    });

    try {
        const database = loadDatabase();
        const account = database.accounts[currentEmail];
        if (!account) {
            sessionStorage.removeItem("chat-demo-auth");
            sessionStorage.removeItem("chat-demo-user-email");
            window.location.replace("login.html");
        } else {
            let chat;
            const contacts = initializeContacts(
                database,
                account,
                (peerEmail) => {
                    chat?.render(peerEmail);
                    contacts.render(peerEmail);
                },
                showAlert
            );
            chat = initializeChat(
                database,
                account,
                (peerEmail) => {
                    const contact = account.contacts.find((entry) => entry.email === peerEmail);
                    if (contact) {
                        contacts.openEdit(contact.id);
                    } else {
                        contacts.openAdd(peerEmail);
                    }
                },
                showAlert
            );
            initializeProfile(database, account, showAlert);
            contacts.render();

            window.addEventListener("storage", (event) => {
                if (event.key === DATABASE_KEY) {
                    window.location.reload();
                }
            });
        }
    } catch (error) {
        main.hidden = true;
        showAlert(error.message || "Dashboard tidak dapat dimuat.");
    }
}
