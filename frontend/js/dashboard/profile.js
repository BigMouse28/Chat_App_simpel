import { findAccountByPhone, isValidName, isValidPhone, normalizePhone, saveDatabase } from "./storage.js";

function setAvatar(element, name, image) {
    element.replaceChildren();

    if (image) {
        const photo = document.createElement("img");
        photo.src = image;
        photo.alt = "";
        element.append(photo);
        return;
    }

    element.textContent = name.trim().charAt(0).toLocaleUpperCase() || "P";
}

export function initializeProfile(database, account, showAlert) {
    const dialog = document.querySelector("#profile-dialog");
    const form = document.querySelector("#profile-form");
    const nameInput = document.querySelector("#profile-name");
    const emailInput = document.querySelector("#profile-email");
    const phoneInput = document.querySelector("#profile-phone");
    const statusInput = document.querySelector("#profile-status");
    const bioInput = document.querySelector("#profile-bio");
    const photoInput = document.querySelector("#profile-photo");
    const profileError = document.querySelector("#profile-error");
    const removePhotoButton = document.querySelector("#remove-profile-photo");

    function render() {
        document.querySelector("#header-name").textContent = account.profile.name;
        document.querySelector("#header-status").textContent = account.profile.status;
        setAvatar(document.querySelector("#header-avatar"), account.profile.name, account.profile.avatar);
        setAvatar(document.querySelector("#profile-avatar"), account.profile.name, account.profile.avatar);
        removePhotoButton.hidden = !account.profile.avatar;
    }

    function open() {
        nameInput.value = account.profile.name;
        emailInput.value = account.profile.email;
        phoneInput.value = account.profile.phone;
        statusInput.value = account.profile.status;
        bioInput.value = account.profile.bio;
        photoInput.value = "";
        profileError.textContent = "";
        dialog.showModal();
    }

    document.querySelector("#open-profile").addEventListener("click", open);

    photoInput.addEventListener("change", () => {
        const file = photoInput.files?.[0];
        if (!file) {
            return;
        }

        if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
            profileError.textContent = "Pilih foto berformat JPEG, PNG, WebP, atau GIF.";
            photoInput.value = "";
            return;
        }

        if (file.size > 1024 * 1024) {
            profileError.textContent = "Ukuran foto maksimal 1 MB.";
            photoInput.value = "";
            return;
        }

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const previousAvatar = account.profile.avatar;
            account.profile.avatar = String(reader.result);
            try {
                saveDatabase(database);
                profileError.textContent = "";
                render();
            } catch (error) {
                account.profile.avatar = previousAvatar;
                profileError.textContent = error.message;
                photoInput.value = "";
            }
        });
        reader.addEventListener("error", () => {
            profileError.textContent = "Foto tidak dapat dibaca. Coba pilih berkas lain.";
            photoInput.value = "";
        });
        reader.readAsDataURL(file);
    });

    removePhotoButton.addEventListener("click", () => {
        const previousAvatar = account.profile.avatar;
        account.profile.avatar = "";
        try {
            saveDatabase(database);
            render();
            profileError.textContent = "";
        } catch (error) {
            account.profile.avatar = previousAvatar;
            profileError.textContent = error.message;
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!isValidName(name)) {
            profileError.textContent = "Nama wajib diisi dan tidak boleh mengandung angka.";
            nameInput.focus();
            return;
        }

        if (!isValidPhone(phone)) {
            profileError.textContent = "Nomor telepon harus berisi 6 sampai 15 angka.";
            phoneInput.focus();
            return;
        }

        const duplicatePhone = findAccountByPhone(database, phone);
        if (duplicatePhone && duplicatePhone[0] !== account.profile.email
            && normalizePhone(duplicatePhone[1].profile.phone) === normalizePhone(phone)) {
            profileError.textContent = "Nomor telepon tersebut sudah digunakan akun lain.";
            phoneInput.focus();
            return;
        }

        const previousProfile = { ...account.profile };
        account.profile.name = name;
        account.profile.phone = phone;
        account.profile.status = statusInput.value;
        account.profile.bio = bioInput.value.trim();

        try {
            saveDatabase(database);
            render();
            dialog.close();
            showAlert("");
        } catch (error) {
            account.profile = previousProfile;
            profileError.textContent = error.message;
        }
    });

    render();
}
