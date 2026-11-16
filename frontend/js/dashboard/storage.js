const STORAGE_KEY_PREFIX = "chat-app-dashboard-v1:";

function storageKey(email) {
    return `${STORAGE_KEY_PREFIX}${encodeURIComponent(email.trim().toLocaleLowerCase() || "anonymous")}`;
}

export function loadState(profileDefaults) {
    const stored = localStorage.getItem(storageKey(profileDefaults.email));
    if (stored === null) {
        return {
            profile: {
                name: profileDefaults.name,
                email: profileDefaults.email,
                phone: profileDefaults.phone,
                status: "Aktif",
                bio: "",
                avatar: ""
            },
            contacts: [],
            messages: {}
        };
    }

    let state;
    try {
        state = JSON.parse(stored);
    } catch {
        throw new Error("Data dashboard tersimpan tidak dapat dibaca. Hapus data situs atau hubungi pengelola.");
    }

    if (
        !state || typeof state !== "object"
        || !state.profile || typeof state.profile !== "object"
        || !Array.isArray(state.contacts)
        || !state.messages || typeof state.messages !== "object"
        || Array.isArray(state.messages)
    ) {
        throw new Error("Struktur data dashboard tersimpan tidak valid.");
    }

    const profileFields = ["name", "email", "phone", "bio", "avatar"];
    if (profileFields.some((field) => state.profile[field] !== undefined && typeof state.profile[field] !== "string")) {
        throw new Error("Data profil tersimpan tidak valid.");
    }

    if (
        state.profile.status !== undefined
        && !["Aktif", "Sibuk", "Tidak di tempat"].includes(state.profile.status)
    ) {
        throw new Error("Status profil tersimpan tidak valid.");
    }

    if (state.contacts.some((contact) =>
        !contact || typeof contact.id !== "string"
        || typeof contact.name !== "string"
        || typeof contact.phone !== "string"
        || typeof contact.bio !== "string"
    )) {
        throw new Error("Data kontak tersimpan tidak valid.");
    }

    for (const messages of Object.values(state.messages)) {
        if (!Array.isArray(messages) || messages.some((message) =>
            !message || typeof message.id !== "string"
            || !["sent", "received"].includes(message.direction)
            || typeof message.text !== "string"
            || typeof message.createdAt !== "string"
        )) {
            throw new Error("Data pesan tersimpan tidak valid.");
        }
    }

    if (
        state.profile.avatar.length > 1_500_000
        || (state.profile.avatar && !/^data:image\/(?:jpeg|png|webp|gif);base64,/i.test(state.profile.avatar))
    ) {
        throw new Error("Foto profil tersimpan tidak valid.");
    }

    state.profile = {
        ...state.profile,
        name: state.profile.name || profileDefaults.name || "Pengguna",
        email: profileDefaults.email || state.profile.email || "",
        phone: state.profile.phone || profileDefaults.phone || "",
        status: state.profile.status || "Aktif",
        bio: state.profile.bio || "",
        avatar: state.profile.avatar || ""
    };

    return state;
}

export function saveState(state) {
    try {
        localStorage.setItem(storageKey(state.profile.email), JSON.stringify(state));
        return true;
    } catch (error) {
        const message = error instanceof DOMException && error.name === "QuotaExceededError"
            ? "Penyimpanan peramban penuh. Hapus sebagian foto atau data obrolan."
            : "Data tidak dapat disimpan di peramban ini.";
        throw new Error(message, { cause: error });
    }
}

export function createId() {
    if (typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function normalizePhone(phone) {
    const trimmed = phone.trim();
    const digits = trimmed.replace(/\D/g, "");
    return `${trimmed.startsWith("+") ? "+" : ""}${digits}`;
}

export function isValidName(name) {
    return name.trim() !== "" && !/\p{N}/u.test(name);
}

export function isValidPhone(phone) {
    const normalized = normalizePhone(phone);
    const digits = normalized.replace(/\D/g, "");
    return /^\+?\d+$/.test(normalized) && digits.length >= 6 && digits.length <= 15;
}
