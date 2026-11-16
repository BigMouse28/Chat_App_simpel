export const DATABASE_KEY = "chat-app-local-messaging-v2";

export function normalizeEmail(email) {
    return email.trim().toLocaleLowerCase();
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

function validateDatabase(database) {
    if (!database || typeof database !== "object" || Array.isArray(database)
        || !database.accounts || typeof database.accounts !== "object" || Array.isArray(database.accounts)
        || !Array.isArray(database.messages)) {
        throw new Error("Struktur data akun tersimpan tidak valid.");
    }

    for (const [email, account] of Object.entries(database.accounts)) {
        if (!account || !account.profile || normalizeEmail(account.profile.email || "") !== email
            || typeof account.profile.name !== "string"
            || typeof account.profile.phone !== "string"
            || (account.profile.verifiedAt !== undefined && typeof account.profile.verifiedAt !== "string")
            || !Array.isArray(account.contacts)) {
            throw new Error("Data akun tersimpan tidak valid.");
        }

        if (!account.profile.verifiedAt) {
            account.profile.verifiedAt = account.profile.createdAt || new Date().toISOString();
        }

        if (account.contacts.some((contact) =>
            !contact || typeof contact.id !== "string"
            || typeof contact.name !== "string"
            || typeof contact.phone !== "string"
            || typeof contact.email !== "string"
        )) {
            throw new Error("Data kontak tersimpan tidak valid.");
        }
    }

    if (database.messages.some((message) =>
        !message || typeof message.id !== "string"
        || typeof message.sender !== "string"
        || typeof message.recipient !== "string"
        || typeof message.text !== "string"
        || typeof message.createdAt !== "string"
    )) {
        throw new Error("Data pesan tersimpan tidak valid.");
    }
}

export function loadDatabase() {
    const stored = localStorage.getItem(DATABASE_KEY);
    if (stored === null) {
        return { accounts: {}, messages: [] };
    }

    let database;
    try {
        database = JSON.parse(stored);
    } catch {
        throw new Error("Data akun tersimpan tidak dapat dibaca. Hapus data situs atau hubungi pengelola.");
    }

    validateDatabase(database);
    return database;
}

export function saveDatabase(database) {
    validateDatabase(database);
    try {
        localStorage.setItem(DATABASE_KEY, JSON.stringify(database));
    } catch (error) {
        const message = error instanceof DOMException && error.name === "QuotaExceededError"
            ? "Penyimpanan peramban penuh. Hapus sebagian foto atau pesan."
            : "Data tidak dapat disimpan di peramban ini.";
        throw new Error(message, { cause: error });
    }
}

export function findAccountByPhone(database, phone) {
    const normalizedPhone = normalizePhone(phone);
    return Object.entries(database.accounts).find(([, account]) =>
        normalizePhone(account.profile.phone) === normalizedPhone
    ) || null;
}

export function createId() {
    if (typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
