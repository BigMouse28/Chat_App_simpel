import { isValidName, isValidPhone, saveState } from "./storage.js";

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

export function initializeProfile(state, showAlert) {
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
        document.querySelector("#header-name").textContent = state.profile.name;
        document.querySelector("#header-status").textContent = state.profile.status;
        setAvatar(document.querySelector("#header-avatar"), state.profile.name, state.profile.avatar);
        setAvatar(document.querySelector("#profile-avatar"), state.profile.name, state.profile.avatar);
        removePhotoButton.hidden = !state.profile.avatar;
    }

    function open() {
        nameInput.value = state.profile.name;
        emailInput.value = state.profile.email;
        phoneInput.value = state.profile.phone;
        statusInput.value = state.profile.status;
        bioInput.value = state.profile.bio;
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
            const previousAvatar = state.profile.avatar;
            state.profile.avatar = String(reader.result);
            try {
                saveState(state);
                profileError.textContent = "";
                render();
            } catch (error) {
                state.profile.avatar = previousAvatar;
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
        const previousAvatar = state.profile.avatar;
        state.profile.avatar = "";
        try {
            saveState(state);
            render();
            profileError.textContent = "";
        } catch (error) {
            state.profile.avatar = previousAvatar;
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

        const previousProfile = { ...state.profile };
        state.profile.name = name;
        state.profile.phone = phone;
        state.profile.status = statusInput.value;
        state.profile.bio = bioInput.value.trim();

        try {
            saveState(state);
            render();
            dialog.close();
            showAlert("");
        } catch (error) {
            state.profile = previousProfile;
            profileError.textContent = error.message;
        }
    });

    render();
}
