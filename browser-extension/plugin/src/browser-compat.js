/**
 * The use of this module is to expose a set of functions to access various browser
 * APIs commonly used in extensions. We can determine here which browser is our extension
 * running on and then export the corresponding browser API functions under common function
 * names, such that the callers of these functions can use these them in a browser-agnostic
 * way without having to make a browser check themselves.
 */

const BROWSER_CHROME = 'chrome';
const BROWSER_FIREFOX = 'firefox';
const BROWSER_UNSUPPORTED = 'unsupported';

let userBrowser;

const userAgent = window.navigator.userAgent.toLowerCase();
if (userAgent.includes('chrome')) {
    userBrowser = BROWSER_CHROME;
} else if (userAgent.includes('firefox')) {
    userBrowser = BROWSER_FIREFOX;
} else {
    userBrowser = BROWSER_UNSUPPORTED;
}

let userBrowserTabs;
let userBrowserContextMenus;
let userBrowserStorage;
let userBrowserRuntime;

if (userBrowser === BROWSER_FIREFOX) {
    userBrowserTabs = browser.tabs;
    userBrowserContextMenus = browser.contextMenus;
    userBrowserStorage = browser.storage;
    userBrowserRuntime = browser.runtime;
} else if (userBrowser === BROWSER_CHROME) {
    userBrowserTabs = chrome.tabs;
    userBrowserContextMenus = chrome.contextMenus;
    userBrowserStorage = chrome.storage;
    userBrowserRuntime = chrome.runtime;
} else {
    // TODO: Indicate to user that browser is unsupported
}

export {
    BROWSER_CHROME,
    BROWSER_FIREFOX,
    BROWSER_UNSUPPORTED,
    userBrowser,
    userBrowserTabs,
    userBrowserContextMenus,
    userBrowserStorage,
    userBrowserRuntime
};
