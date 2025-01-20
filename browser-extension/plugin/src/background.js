import { initializeDatabase } from "./indexeddb";
initializeDatabase().catch(console.error);

// import { userBrowserTabs, userBrowserContextMenus } from './browser-compat';
console.log('bg script 7');

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
