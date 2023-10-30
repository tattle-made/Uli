console.log('bg script 7');

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.url) {
        console.log('url changed');
        chrome.tabs.sendMessage(tabId, {
            message: 'URL_CHANGED',
            url: changeInfo.url
        });
    }
});

let userBrowser;
const userAgent = navigator.userAgent.toString();
if (userAgent.indexOf('Mozilla')) {
    userBrowser = 'firefox';
} else if (userAgent.indexOf('Chrome')) {
    userBrowser = 'chrome';
} else {
    userBrowser = 'unsupported';
}

let contextMenus;
let tabs;
console.log(userBrowser);
if (userBrowser === 'firefox') {
    contextMenus = browser.contextMenus;
    tabs = browser.tabs;
} else if (userBrowser === 'chrome') {
    contextMenus = chrome.contextMenus;
    tabs = chrome.tabs;
}
console.log(contextMenus);

contextMenus.create(
    {
        id: 'add-slur-crowdsource',
        title: 'Add Slur to Uli and Crowdsource',
        contexts: ['selection']
    },
    () => {
        console.log('Unified context menu created');
    }
);

contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'add-slur-crowdsource') {
        console.log('Slur added and Crowdsourced');
        tabs.sendMessage(
            tab.id,
            { type: 'SLUR_ADDED_AND_CROWDSOURCE_SLUR_WORD', slur: info.selectionText,crowdsourcedSlur: info.selectionText },
            function (response) {
                console.log(response);
            }
        );
    } else {
        console('unexpected action');
    }
});

