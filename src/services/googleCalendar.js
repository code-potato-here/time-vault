/* global google, gapi */

const CLIENT_ID = '311173365021-g1siar6dnkdq19gq2ae4eba61m6nlh6b.apps.googleusercontent.com'; // User will need to fill this
const API_KEY = ''; // User will need to fill this, or just use OAuth
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

let tokenClient;
let gapiInited = false;
let gisInited = false;

export const initGoogleClient = (clientId, apiKey) => {
    const finalClientId = clientId || CLIENT_ID;
    const finalApiKey = apiKey || API_KEY;

    return new Promise((resolve, reject) => {
        gapi.load('client', async () => {
            try {
                await gapi.client.init({
                    apiKey: finalApiKey,
                    discoveryDocs: DISCOVERY_DOCS,
                });
                gapiInited = true;
                checkInit(resolve);
            } catch (err) {
                console.error("GAPI Init Error", err);
                resolve(); // Resolve to allow app to continue rendering
            }
        });

        if (finalClientId) {
            try {
                tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: finalClientId,
                    scope: SCOPES,
                    callback: '', // defined later
                });
                gisInited = true;
                checkInit(resolve);
            } catch (err) {
                console.error("GIS Init Error", err);
            }
        } else {
            console.error("Client ID missing for GIS init");
        }
    });
};

function checkInit(resolve) {
    if (gapiInited && gisInited) {
        resolve();
    }
}

export const handleAuthClick = () => {
    return new Promise((resolve, reject) => {
        tokenClient.callback = async (resp) => {
            if (resp.error) {
                reject(resp);
            }
            resolve(resp);
        };

        if (gapi.client.getToken() === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            tokenClient.requestAccessToken({ prompt: '' });
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
