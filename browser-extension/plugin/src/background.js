import { userBrowserTabs, userBrowserContextMenus } from './browser-compat';
console.log('bg script 7');

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
contextMenus.create(
    {
        id: 'add-crowdsource-slur',
        title: 'Crowdsource Slur Word',
        contexts: ['selection']
    },
    () => {
        console.log('crowdsource context menu created');
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
        case 'add-crowdsource-slur':
            console.log('Crowdsource slur word added');
            tabs.sendMessage(
                tab.id,
                {
                    type: 'CROWDSOURCE_SLUR_WORD',
                    crowdsourcedSlur: info.selectionText
                },
                function (response) {
                    console.log(response);
                }
            );
            break;
        default:
            console('unexpected action');
    }
});
