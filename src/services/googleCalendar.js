/* global google, gapi */

// Use environment variable if available, fallback to default Client ID
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '311173365021-g1siar6dnkdq19gq2ae4eba61m6nlh6b.apps.googleusercontent.com';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Check if Google API scripts are loaded
const waitForGoogleAPIs = () => {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait

        const checkLoaded = () => {
            attempts++;
            if (typeof gapi !== 'undefined' && typeof google !== 'undefined') {
                resolve();
            } else if (attempts >= maxAttempts) {
                reject(new Error('Google API scripts failed to load. Please refresh the page.'));
            } else {
                setTimeout(checkLoaded, 100);
            }
        };

        checkLoaded();
    });
};

export const initGoogleClient = (clientId) => {
    const finalClientId = clientId || CLIENT_ID;

    return new Promise(async (resolve, reject) => {
        try {
            // Wait for scripts to load
            await waitForGoogleAPIs();

            // Initialize GAPI client (no API key needed for OAuth)
            gapi.load('client', async () => {
                try {
                    await gapi.client.init({
                        discoveryDocs: DISCOVERY_DOCS,
                    });
                    gapiInited = true;
                    checkInit(resolve, reject);
                } catch (err) {
                    console.error("GAPI Init Error:", err);
                    reject(new Error('Failed to initialize Google Calendar API. Please check your internet connection.'));
                }
            });

            // Initialize OAuth token client
            if (finalClientId) {
                try {
                    tokenClient = google.accounts.oauth2.initTokenClient({
                        client_id: finalClientId,
                        scope: SCOPES,
                        callback: '', // defined later
                    });
                    gisInited = true;
                    checkInit(resolve, reject);
                } catch (err) {
                    console.error("GIS Init Error:", err);
                    reject(new Error('Failed to initialize Google Sign-In. Please check your Client ID.'));
                }
            } else {
                reject(new Error('Missing Google Client ID. Please configure your OAuth credentials.'));
            }
        } catch (err) {
            reject(err);
        }
    });
};

function checkInit(resolve, reject) {
    if (gapiInited && gisInited) {
        resolve();
    }
}

export const handleAuthClick = () => {
    return new Promise((resolve, reject) => {
        if (!tokenClient) {
            reject(new Error('Google Sign-In not initialized. Please refresh the page.'));
            return;
        }

        tokenClient.callback = async (resp) => {
            if (resp.error) {
                console.error('Auth error:', resp);
                reject(new Error(resp.error_description || 'Authentication failed. Please try again.'));
                return;
            }
            resolve(resp);
        };

        try {
            if (gapi.client.getToken() === null) {
                // Prompt the user to select a Google Account and ask for consent to share their data
                tokenClient.requestAccessToken({ prompt: 'consent' });
            } else {
                // Skip display of account chooser and consent dialog for an existing session.
                tokenClient.requestAccessToken({ prompt: '' });
            }
        } catch (err) {
            console.error('Token request error:', err);
            reject(new Error('Failed to open sign-in popup. Please check if popups are blocked.'));
        }
    });
};

export const handleSignoutClick = () => {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
    }
};

export const createCalendarEvent = async (capsule) => {
    const event = {
        'summary': 'Time Capsule Opening: ' + (capsule.title || 'A Memory'),
        'description': `Your time capsule is ready to open! View it here: ${window.location.origin}/open/${capsule.id}`,
        'start': {
            'dateTime': capsule.unlockDate, // ISO string
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        'end': {
            'dateTime': new Date(new Date(capsule.unlockDate).getTime() + 30 * 60000).toISOString(), // 30 mins
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        'reminders': {
            'useDefault': false,
            'overrides': [
                { 'method': 'email', 'minutes': 24 * 60 },
                { 'method': 'popup', 'minutes': 10 },
            ],
        },
    };

    try {
        const response = await gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event,
        });
        return response.result;
    } catch (err) {
        console.error("Error creating event", err);
        throw err;
    }
}

export const getCalendarEvent = async (eventId) => {
    try {
        const response = await gapi.client.calendar.events.get({
            'calendarId': 'primary',
            'eventId': eventId,
        });
        return response.result;
    } catch (err) {
        console.error("Error fetching event", err);
        throw err;
    }
}
