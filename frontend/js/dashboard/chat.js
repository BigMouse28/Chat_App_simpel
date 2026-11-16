import { createId, saveState } from "./storage.js";

export function initializeChat(state, onEditContact, showAlert) {
    const emptyState = document.querySelector("#empty-chat");
    const conversation = document.querySelector("#conversation");
    const nameHeading = document.querySelector("#conversation-name");
    const phoneHeading = document.querySelector("#conversation-phone");
    const bioHeading = document.querySelector("#conversation-bio");
    const avatar = document.querySelector("#conversation-avatar");
    const messageList = document.querySelector("#message-list");
    const emptyMessages = document.querySelector("#empty-messages");
    const messageForm = document.querySelector("#message-form");
    const messageInput = document.querySelector("#message-input");
    const incomingForm = document.querySelector("#incoming-message-form");
    const incomingInput = document.querySelector("#incoming-message-input");
    let activeContactId = "";

    function render(id = activeContactId) {
        activeContactId = id;
        const contact = state.contacts.find((entry) => entry.id === activeContactId);
        if (!contact) {
            activeContactId = "";
            conversation.hidden = true;
            emptyState.hidden = false;
            return;
        }

        emptyState.hidden = true;
        conversation.hidden = false;
        nameHeading.textContent = contact.name;
        phoneHeading.textContent = contact.phone;
        bioHeading.textContent = contact.bio;
        avatar.textContent = contact.name.charAt(0).toLocaleUpperCase() || "K";

        const messages = state.messages[activeContactId] || [];
        messageList.replaceChildren();
        for (const message of messages) {
            const item = document.createElement("li");
            item.className = `message ${message.direction === "sent" ? "message--sent" : "message--received"}`;
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

    function addMessage(direction, text) {
        if (!activeContactId) {
            return false;
        }

        const content = text.trim();
        if (!content) {
            return false;
        }

        const previousMessages = state.messages[activeContactId];
        const messages = previousMessages || [];
        state.messages[activeContactId] = [
            ...messages,
            {
                id: createId(),
                direction,
                text: content,
                createdAt: new Date().toISOString()
            }
        ];

        try {
            saveState(state);
            render();
            showAlert("");
            return true;
        } catch (error) {
            if (previousMessages) {
                state.messages[activeContactId] = previousMessages;
            } else {
                delete state.messages[activeContactId];
            }
            showAlert(error.message);
            return false;
        }
    }

    messageForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!activeContactId) {
            return;
        }

        const text = messageInput.value;
        if (!addMessage("sent", text)) {
            return;
        }
        messageInput.value = "";
        messageInput.focus();
    });

    incomingForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!activeContactId) {
            return;
        }

        if (!addMessage("received", incomingInput.value)) {
            return;
        }
        incomingInput.value = "";
    });

    document.querySelector("#edit-active-contact").addEventListener("click", () => {
        if (activeContactId) {
            onEditContact(activeContactId);
        }
    });

    return {
        render,
        get activeContactId() {
            return activeContactId;
        }
    };
}
