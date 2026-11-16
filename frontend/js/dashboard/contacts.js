import { createId, findAccountByPhone, isValidName, isValidPhone, normalizeEmail, normalizePhone, saveDatabase } from "./storage.js";

export function initializeContacts(database, account, onSelect, showAlert) {
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
    let selectedEmail = "";

    function getRows() {
        const contacts = account.contacts.map((contact) => {
            const target = database.accounts[normalizeEmail(contact.email)]?.profile;
            return {
                email: normalizeEmail(contact.email),
                name: contact.name || target?.name || "Kontak",
                phone: target?.phone || contact.phone,
                avatar: target?.avatar || "",
                contact
            };
        });
        const contactEmails = new Set(contacts.map((contact) => contact.email));
        const unknownThreads = new Map();

        for (const message of database.messages) {
            if (message.sender !== account.profile.email && message.recipient !== account.profile.email) {
                continue;
            }

            const peerEmail = message.sender === account.profile.email ? message.recipient : message.sender;
            if (contactEmails.has(peerEmail)) {
                continue;
            }

            const peer = database.accounts[peerEmail]?.profile;
            if (peer) {
                unknownThreads.set(peerEmail, {
                    email: peerEmail,
                    name: peer.name,
                    phone: peer.phone,
                    avatar: peer.avatar,
                    contact: null
                });
            }
        }

        return [...contacts, ...unknownThreads.values()];
    }

    function render(peerEmail = selectedEmail) {
        selectedEmail = peerEmail;
        const query = searchInput.value.trim().toLocaleLowerCase();
        const rows = getRows().filter((row) =>
            `${row.name} ${row.phone}`.toLocaleLowerCase().includes(query)
        );
        list.replaceChildren();

        for (const row of rows) {
            const item = document.createElement("li");
            item.className = "contact-item";
            if (row.email === selectedEmail) {
                item.classList.add("contact-item--selected");
            }

            const openButton = document.createElement("button");
            openButton.type = "button";
            openButton.className = "contact-open";
            openButton.addEventListener("click", () => onSelect(row.email));

            const avatar = document.createElement("span");
            avatar.className = "avatar";
            if (row.avatar) {
                const image = document.createElement("img");
                image.src = row.avatar;
                image.alt = "";
                image.loading = "lazy";
                avatar.append(image);
            } else {
                avatar.textContent = row.name.charAt(0).toLocaleUpperCase() || "K";
            }

            const details = document.createElement("span");
            details.className = "contact-details";
            const name = document.createElement("span");
            name.className = "contact-name";
            name.textContent = row.name;
            const phone = document.createElement("span");
            phone.className = "contact-phone";
            phone.textContent = row.contact ? row.phone : `${row.phone} · belum dikenal`;
            details.append(name, phone);
            openButton.append(avatar, details);

            const actions = document.createElement("span");
            actions.className = "contact-actions";
            if (row.contact) {
                const editButton = document.createElement("button");
                editButton.type = "button";
                editButton.className = "contact-action";
                editButton.textContent = "Ubah";
                editButton.setAttribute("aria-label", `Ubah kontak ${row.name}`);
                editButton.addEventListener("click", () => openEdit(row.contact.id));
                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.className = "contact-action";
                deleteButton.textContent = "Hapus";
                deleteButton.setAttribute("aria-label", `Hapus kontak ${row.name}`);
                deleteButton.addEventListener("click", () => remove(row.contact.id));
                actions.append(editButton, deleteButton);
            } else {
                const addButton = document.createElement("button");
                addButton.type = "button";
                addButton.className = "contact-action";
                addButton.textContent = "Simpan";
                addButton.setAttribute("aria-label", `Simpan ${row.name} sebagai kontak`);
                addButton.addEventListener("click", () => openAdd(row.email));
                actions.append(addButton);
            }

            item.append(openButton, actions);
            list.append(item);
        }

        emptyMessage.hidden = rows.length > 0;
        if (query && rows.length === 0) {
            emptyMessage.textContent = "Percakapan tidak ditemukan.";
        } else if (rows.length === 0) {
            emptyMessage.textContent = "Belum ada kontak atau pesan masuk. Tambahkan kontak untuk memulai obrolan.";
        }
    }

    function openAdd(email = "") {
        form.reset();
        idInput.value = "";
        title.textContent = "Tambah kontak";
        saveButton.textContent = "Simpan kontak";
        errorMessage.textContent = "";
        if (email) {
            const target = database.accounts[email]?.profile;
            if (target) {
                nameInput.value = target.name;
                phoneInput.value = target.phone;
                bioInput.value = target.bio || "";
            }
        }
        dialog.showModal();
        nameInput.focus();
    }

    function openEdit(id) {
        const contact = account.contacts.find((entry) => entry.id === id);
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
        const contact = account.contacts.find((entry) => entry.id === id);
        if (!contact || !window.confirm(`Hapus kontak ${contact.name}? Riwayat pesan tidak akan dihapus.`)) {
            return;
        }

        const previousContacts = account.contacts;
        account.contacts = account.contacts.filter((entry) => entry.id !== id);
        try {
            saveDatabase(database);
            render();
            if (selectedEmail === contact.email) {
                onSelect("");
            }
            showAlert("");
        } catch (error) {
            account.contacts = previousContacts;
            showAlert(error.message);
        }
    }

    document.querySelector("#open-add-contact").addEventListener("click", () => openAdd());
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

        const target = findAccountByPhone(database, phone);
        if (!target) {
            errorMessage.textContent = "Tidak ada akun terdaftar dengan nomor telepon tersebut.";
            phoneInput.focus();
            return;
        }

        const [targetEmail, targetAccount] = target;
        if (targetEmail === account.profile.email) {
            errorMessage.textContent = "Anda tidak dapat menambahkan akun sendiri sebagai kontak.";
            phoneInput.focus();
            return;
        }

        const duplicate = account.contacts.some((contact) =>
            contact.id !== contactId && normalizeEmail(contact.email) === targetEmail
        );
        if (duplicate) {
            errorMessage.textContent = "Akun tersebut sudah ada di daftar kontak.";
            phoneInput.focus();
            return;
        }

        const previousContacts = account.contacts;
        const contact = {
            id: contactId || createId(),
            email: targetEmail,
            name,
            phone: targetAccount.profile.phone,
            bio: bioInput.value.trim()
        };
        account.contacts = contactId
            ? account.contacts.map((entry) => entry.id === contactId ? contact : entry)
            : [...account.contacts, contact];

        try {
            saveDatabase(database);
            render(targetEmail);
            dialog.close();
            showAlert("");
            onSelect(targetEmail);
        } catch (error) {
            account.contacts = previousContacts;
            errorMessage.textContent = error.message;
        }
    });

    return {
        openAdd,
        openEdit,
        render
    };
}
