import { createId, isValidName, isValidPhone, normalizePhone, saveState } from "./storage.js";

export function initializeContacts(state, onSelect, showAlert) {
    const list = document.querySelector("#contact-list");
    const emptyMessage = document.querySelector("#empty-contacts");
    const searchInput = document.querySelector("#search-contact");
    const dialog = document.querySelector("#contact-dialog");
    const form = document.querySelector("#contact-form");
    const idInput = document.querySelector("#contact-id");
    const nameInput = document.querySelector("#contact-name");
    const phoneInput = document.querySelector("#contact-phone");
    const bioInput = document.querySelector("#contact-bio");
    const errorMessage = document.querySelector("#contact-error");
    const title = document.querySelector("#contact-dialog-title");
    const saveButton = document.querySelector("#save-contact-button");
    let selectedId = "";

    function render(selectedContactId = selectedId) {
        selectedId = selectedContactId;
        const query = searchInput.value.trim().toLocaleLowerCase();
        const contacts = state.contacts.filter((contact) =>
            `${contact.name} ${contact.phone}`.toLocaleLowerCase().includes(query)
        );
        list.replaceChildren();

        for (const contact of contacts) {
            const item = document.createElement("li");
            item.className = "contact-item";
            if (contact.id === selectedId) {
                item.classList.add("contact-item--selected");
            }

            const openButton = document.createElement("button");
            openButton.type = "button";
            openButton.className = "contact-open";
            openButton.addEventListener("click", () => onSelect(contact.id));

            const avatar = document.createElement("span");
            avatar.className = "avatar";
            avatar.textContent = contact.name.charAt(0).toLocaleUpperCase() || "K";

            const details = document.createElement("span");
            details.className = "contact-details";
            const name = document.createElement("span");
            name.className = "contact-name";
            name.textContent = contact.name;
            const phone = document.createElement("span");
            phone.className = "contact-phone";
            phone.textContent = contact.phone;
            details.append(name, phone);
            openButton.append(avatar, details);

            const actions = document.createElement("span");
            actions.className = "contact-actions";
            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "contact-action";
            editButton.textContent = "Ubah";
            editButton.setAttribute("aria-label", `Ubah kontak ${contact.name}`);
            editButton.addEventListener("click", () => openEdit(contact.id));
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "contact-action";
            deleteButton.textContent = "Hapus";
            deleteButton.setAttribute("aria-label", `Hapus kontak ${contact.name}`);
            deleteButton.addEventListener("click", () => remove(contact.id));
            actions.append(editButton, deleteButton);

            item.append(openButton, actions);
            list.append(item);
        }

        emptyMessage.hidden = contacts.length > 0;
        if (query && contacts.length === 0) {
            emptyMessage.textContent = "Kontak tidak ditemukan.";
        } else if (contacts.length === 0) {
            emptyMessage.textContent = "Belum ada kontak. Tambahkan kontak untuk memulai obrolan.";
        }
    }

    function openAdd() {
        form.reset();
        idInput.value = "";
        title.textContent = "Tambah kontak";
        saveButton.textContent = "Simpan kontak";
        errorMessage.textContent = "";
        dialog.showModal();
        nameInput.focus();
    }

    function openEdit(id) {
        const contact = state.contacts.find((entry) => entry.id === id);
        if (!contact) {
            showAlert("Kontak tidak ditemukan.");
            return;
        }

        idInput.value = contact.id;
        nameInput.value = contact.name;
        phoneInput.value = contact.phone;
        bioInput.value = contact.bio;
        title.textContent = "Ubah kontak";
        saveButton.textContent = "Simpan perubahan";
        errorMessage.textContent = "";
        dialog.showModal();
    }

    function remove(id) {
        const contact = state.contacts.find((entry) => entry.id === id);
        if (!contact || !window.confirm(`Hapus kontak ${contact.name} dan riwayat obrolannya?`)) {
            return;
        }

        const wasSelected = id === selectedId;
        const previousContacts = state.contacts;
        const previousMessages = state.messages[id];
        state.contacts = state.contacts.filter((entry) => entry.id !== id);
        delete state.messages[id];

        try {
            saveState(state);
            render();
            if (wasSelected) {
                selectedId = "";
                onSelect("");
            }
            showAlert("");
        } catch (error) {
            state.contacts = previousContacts;
            if (previousMessages) {
                state.messages[id] = previousMessages;
            }
            showAlert(error.message);
        }
    }

    document.querySelector("#open-add-contact").addEventListener("click", openAdd);
    searchInput.addEventListener("input", () => render());

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const contactId = idInput.value;

        if (!isValidName(name)) {
            errorMessage.textContent = "Nama wajib diisi dan tidak boleh mengandung angka.";
            nameInput.focus();
            return;
        }

        if (!isValidPhone(phone)) {
            errorMessage.textContent = "Nomor telepon harus berisi 6 sampai 15 angka.";
            phoneInput.focus();
            return;
        }

        const normalizedPhone = normalizePhone(phone);
        const duplicate = state.contacts.some((contact) =>
            contact.id !== contactId && normalizePhone(contact.phone) === normalizedPhone
        );
        if (duplicate) {
            errorMessage.textContent = "Nomor telepon tersebut sudah ada di daftar kontak.";
            phoneInput.focus();
            return;
        }

        const previousContacts = state.contacts;
        const contact = {
            id: contactId || createId(),
            name,
            phone,
            bio: bioInput.value.trim()
        };

        if (contactId) {
            state.contacts = state.contacts.map((entry) => entry.id === contactId ? contact : entry);
        } else {
            state.contacts = [...state.contacts, contact];
        }

        try {
            saveState(state);
            render(contact.id);
            dialog.close();
            showAlert("");
            onSelect(contact.id);
        } catch (error) {
            state.contacts = previousContacts;
            errorMessage.textContent = error.message;
        }
    });

    return {
        openEdit,
        render
    };
}
