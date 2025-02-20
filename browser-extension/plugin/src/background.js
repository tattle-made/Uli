import Dexie from 'dexie';
import {
    initializeSlurs,
    getAllSlurs,
    convertSlurMetadataFromDBtoJSON
} from './slur-store';
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
