import Dexie from 'dexie';
import {
    initializeSlurs,
    getAllSlurs,
    convertSlurMetadataFromDBtoJSON,
    getSlursBySource,
    addSlur,
    deleteSlur,
    slurExists,
    bulkAddSlurs,
    fetchPublicSlursMetadata
} from './slur-store';
import { getPublicSlurs } from './api/public-slurs';
console.log('bg script 8');

let db;
db = new Dexie('SlurWordsDatabase');
db.version(1).stores({
    words: '++id, word, source, enable_status',
    words_metadata:
        '++id, label, level_of_severity, meaning, categories, language, timestamp'
});
console.log('Database initialized');

const BROWSER_CHROME = 'chrome';
const BROWSER_FIREFOX = 'firefox';
const BROWSER_UNSUPPORTED = 'unsupported';

let userBrowser;

const userAgent = navigator.userAgent.toLowerCase();
if (userAgent.includes('chrome')) {
    userBrowser = BROWSER_CHROME;
} else if (userAgent.includes('firefox')) {
    userBrowser = BROWSER_FIREFOX;
} else {
    userBrowser = BROWSER_UNSUPPORTED;
}

let userBrowserTabs;
let userBrowserContextMenus;

if (userBrowser === BROWSER_FIREFOX) {
    userBrowserTabs = browser.tabs;
    userBrowserContextMenus = browser.contextMenus;
} else if (userBrowser === BROWSER_CHROME) {
    userBrowserTabs = chrome.tabs;
    userBrowserContextMenus = chrome.contextMenus;
} else {
    // TODO: Indicate to user that browser is unsupported
}

userBrowserTabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.url) {
        console.log('url changed');
        userBrowserTabs.sendMessage(tabId, {
            message: 'URL_CHANGED',
            url: changeInfo.url
        });
    }
});

userBrowserContextMenus.removeAll(() => {
    userBrowserContextMenus.create(
        {
            id: 'add-slur',
            title: 'Add Slur to Uli',
            contexts: ['selection']
        },
        () => {
            console.log('context menu created');
        }
    );
});

userBrowserContextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case 'add-slur':
            console.log('slur added');
            userBrowserTabs.sendMessage(
                tab.id,
                { type: 'SLUR_ADDED', slur: info.selectionText },
                function (response) {
                    console.log(response);
                }
            );
            break;
        default:
            console('unexpected action');
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        case 'initializeSlurs':
            handleInitSlurs(request, sendResponse, db);
            return true;
        case 'updateDataMsgToBG':
            handleUpdateData(request, sendResponse, db);
            return true;
        case 'fetchPersonalSlursToBG':
            handleFetchPersonalSlurs(request, sendResponse, db);
            return true;
        case 'syncApprovedCrowdsourcedSlursToBG':
            handleSyncApprovedSlurs(request, sendResponse, db);
            return true;
        default:
            return false;
    }
});

async function handleInitSlurs(request, sendResponse, db) {
    try {
        await initializeSlurs(db);
        allSlurWords = await getAllSlurs(db);
        allMetadata = await convertSlurMetadataFromDBtoJSON(db);
        sendResponse({
            status: 200,
            allSlurWords: allSlurWords,
            allMetadata: allMetadata
        });
    } catch (error) {
        console.error('Error initializing slurs in service worker:', error);
        sendResponse({ status: 400, message: error.message });
    }
}

async function handleUpdateData(request, sendResponse, db) {
    try {
        console.log("inside handle udpate data BG");
        const newSlurs = request.data;
        console.log('New slurs received:', newSlurs);

        // Fetch existing slurs
        const existingSlurs = (await getSlursBySource(db, 'personal')).map(
            (slur) => slur.word
        );
        // Add new slurs to the database
        for (const slur of newSlurs) {
            if (!existingSlurs.includes(slur)) {
                await addSlur(db, slur, 'personal');
            }
        }
        // Remove slurs from the database that no longer exist in the new list
        for (const slur of existingSlurs) {
            if (!newSlurs.includes(slur)) {
                await deleteSlur(db, slur, 'personal');
            }
        }
        sendResponse({ status: 200 });
    } catch (error) {
        console.error('Error during updating slur list:', error);
        sendResponse({ status: 400, message: error.message });
    }
}

async function handleFetchPersonalSlurs(request, sendResponse, db) {
    try {
        console.log('Fetching personal slurs');
        const personalSlurs = await getSlursBySource(db, 'personal');
        const slurArr = personalSlurs.map((slur) => slur.word);
        console.log('Sending personal slurs:', slurArr);
        sendResponse(slurArr);
    } catch (error) {
        console.error('Error fetching personal slurs:', error);
        sendResponse({ status: 400, message: error.message });
    }
}

async function handleSyncApprovedSlurs(request, sendResponse, db) {
    const source = 'public_crowdsourced_slurs';
    try {
        const publicSlurs = await getPublicSlurs();
        const publicSlursArray = publicSlurs.map((slur) => slur.label);
        console.log('Public slurs fetched:', publicSlursArray);

        const filteredSlurs = [];
        for (const slur of publicSlursArray) {
            const exists = await slurExists(db, slur, source);
            if (!exists) {
                filteredSlurs.push(slur);
            }
        }

        // If there are slurs to add, bulk add them to the database
        if (filteredSlurs.length > 0) {
            await bulkAddSlurs(db, filteredSlurs, source);
            console.log(`${filteredSlurs.length} new slurs added from source: ${source}`);
        } else {
            console.log('No new slurs to add.');
        }

        // Fetch public metadata again
        await fetchPublicSlursMetadata(db);
        sendResponse({ status: 200 });
    } catch (error) {
        console.error('Error syncing approved slurs:', error);
        sendResponse({ status: 400, message: error.message });
    }
}

