/**
 * Service to handle local storage of capsules.
 * 
 * Capsule Structure:
 * {
 *   id: string (uuid),
 *   message: string,
 *   imageUrl: string (base64 or url),
 *   unlockDate: string (ISO date),
 *   calendarEventId: string,
 *   createdAt: string (ISO date),
 *   isSynced: boolean
 * }
 */

const STORAGE_KEY = 'digital_time_capsule_data';

export const saveCapsule = (capsule) => {
    const currentData = getCapsules();
    const updatedData = [...currentData, capsule];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return capsule;
};

export const getCapsules = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const getCapsuleById = (id) => {
    const capsules = getCapsules();
    return capsules.find(c => c.id === id);
};

export const deleteCapsule = (id) => {
    const capsules = getCapsules();
    const updated = capsules.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const updateCapsule = (id, updates) => {
    const capsules = getCapsules();
    const index = capsules.findIndex(c => c.id === id);
    if (index !== -1) {
        capsules[index] = { ...capsules[index], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(capsules));
        return capsules[index];
    }
    return null;
};
