import { createId, saveDatabase } from "./storage.js";

export function initializeChat(database, account, onManageContact, showAlert) {
    const emptyState = document.querySelector("#empty-chat");
    const conversation = document.querySelector("#conversation");
    const nameHeading = document.querySelector("#conversation-name");
    const phoneHeading = document.querySelector("#conversation-phone");
    const statusHeading = document.querySelector("#conversation-status");
    const bioHeading = document.querySelector("#conversation-bio");
    const avatar = document.querySelector("#conversation-avatar");
    const messageList = document.querySelector("#message-list");
    const emptyMessages = document.querySelector("#empty-messages");
    const messageForm = document.querySelector("#message-form");
    const messageInput = document.querySelector("#message-input");
    const manageContactButton = document.querySelector("#edit-active-contact");
    let activeEmail = "";

    function render(peerEmail = activeEmail) {
        activeEmail = peerEmail;
        const peer = database.accounts[activeEmail]?.profile;
        if (!peer || activeEmail === account.profile.email) {
            activeEmail = "";
            conversation.hidden = true;
            emptyState.hidden = false;
            return;
        }

        emptyState.hidden = true;
        conversation.hidden = false;
        nameHeading.textContent = peer.name;
        phoneHeading.textContent = peer.phone;
        statusHeading.textContent = `Status: ${peer.status || "Aktif"}`;
        bioHeading.textContent = peer.bio || "Belum ada info profil.";
        avatar.replaceChildren();
        if (peer.avatar) {
            const image = document.createElement("img");
            image.src = peer.avatar;
            image.alt = "";
            image.loading = "lazy";
            avatar.append(image);
        } else {
            avatar.textContent = peer.name.charAt(0).toLocaleUpperCase() || "K";
        }

        const isContact = account.contacts.some((contact) => contact.email === activeEmail);
        manageContactButton.textContent = isContact ? "Ubah kontak" : "Simpan kontak";
        const messages = database.messages.filter((message) =>
            (message.sender === account.profile.email && message.recipient === activeEmail)
            || (message.sender === activeEmail && message.recipient === account.profile.email)
        );
        messageList.replaceChildren();
        for (const message of messages) {
            const direction = message.sender === account.profile.email ? "sent" : "received";
            const item = document.createElement("li");
            item.className = `message ${direction === "sent" ? "message--sent" : "message--received"}`;
            item.append(document.createTextNode(message.text));

            const time = document.createElement("time");
            time.className = "message-time";
            time.dateTime = message.createdAt;
            time.textContent = new Date(message.createdAt).toLocaleString("id-ID", {
                hour: "2-digit",
                minute: "2-digit"
            });
            item.append(time);
            messageList.append(item);
        }

        emptyMessages.hidden = messages.length > 0;
        messageList.hidden = messages.length === 0;
        messageList.scrollTop = messageList.scrollHeight;
    }

    function send(text) {
        if (!activeEmail || !database.accounts[activeEmail]) {
            showAlert("Penerima tidak ditemukan. Tambahkan nomor yang terdaftar.");
            return false;
        }
        const content = text.trim();
        if (!content) {
            return false;
        }

        const message = {
            id: createId(),
            sender: account.profile.email,
            recipient: activeEmail,
            text: content,
            createdAt: new Date().toISOString()
        };
        database.messages.push(message);
        try {
            saveDatabase(database);
            render();
            showAlert("");
            return true;
        } catch (error) {
            database.messages.pop();
            showAlert(error.message);
            return false;
        }
    }

    messageForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (send(messageInput.value)) {
            messageInput.value = "";
            messageInput.focus();
        }
    });

    manageContactButton.addEventListener("click", () => {
        if (activeEmail) {
            onManageContact(activeEmail);
        }
    });

    return {
        render,
        get activeEmail() {
            return activeEmail;
        }
    };
}
