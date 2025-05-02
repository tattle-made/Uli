import { dom } from './twitter';
import { current } from './twitter/pages';
const { setOnChangeListener } = dom;
import transform_v2 from './transform-v2';
import { log } from './logger';
import repository from './repository';
const { getUserData, getPreferenceData, setPreferenceData } = repository;
import transformGeneral from './transform-general';
import { createCrowdsourceSlur } from './api/crowdsource-slurs';
import { initializeSlurReplaceExpressions } from './slur-replace';
import { userBrowserRuntime } from './browser-compat';

log('Content Script Loaded Test 2');

// test function to log variables in console
(async function test() {
    console.log('Async Test');
})();

var mainLoadedChecker;

function processPage(newUrl) {
    const twitterUrl = 'twitter.com';
    if (newUrl.includes(twitterUrl)) {
        mainLoadedChecker = setInterval(() => {
            if (newUrl.includes(twitterUrl)) {
                console.log('tick');
                const targetNode = document.getElementsByTagName('main')[0];
                console.log({ targetNode });
                if (targetNode) {
                    let currentPage = current(newUrl);
                    const { page } = currentPage;
                    const { getTimeline } = page;

                    if (getTimeline === undefined) {
                        log('Unknown State. Could not find Timeline');
                    } else {
                        let timeline = getTimeline();
                        // log({ timeline });
                        transform_v2.processNewlyAddedNodes_v2(
                            timeline.children
                        ); //changed to v2 here
                        setOnChangeListener(
                            timeline,
                            transform_v2.processNewlyAddedNodes_v2
                        );
                    }

                    clearInterval(mainLoadedChecker);
                } else {
                    console.log('main section loaded');
                }
            }
        }, 500);
    } else {
        mainLoadedChecker = setInterval(() => {
            console.log('tick');
            let body = document.getElementsByTagName('body');
            let first_body = body[0];

            if (first_body) {
                console.log('tick 2');
                transformGeneral.processNewlyAddedNodesGeneral(first_body);
                clearInterval(mainLoadedChecker);
                console.log(mainLoadedChecker);
            } else {
                console.log('main section loaded');
            }
        }, 500);
    }
}

/**
 * Register message listeners from extension, background scripts or service workers.
 *
 * Example code to handle a message
 * chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
 *      sendResponse(10);
 *      return true;
 * });
 * addListener's callback function MUST return a true or false.
 *
 * If the callback function is asynchronous, it must send an explicit `true` and use the `sendResponse`
 * function to return the response. If it is synchronous, it must return false.
//  */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        case 'SLUR_ADDED':
            return handleMessageSlurAdded(request);
        case 'ULI_ENABLE_SLUR_REPLACEMENT':
            if (!request.payload) {
                clearInterval(mainLoadedChecker);
            }
            return true;
        case 'URL_CHANGED':
            return processPage(location.href);
        default:
            return false;
    }
});

async function handleMessageSlurAdded(request) {
    const slur = request.slur;
    const page_url = request.page_url
    // log('slur added from bg', slur);

    // Adding Slur to IndexedDB
    // try {
    //     const exists = await slurExists(slur, 'personal');

    //     if (!exists) {
    //         await addSlur(slur, 'personal');
    //         log('Slur added to IndexedDB:', slur);
    //     } else {
    //         log('Slur already exists in IndexedDB, skipping:', slur);
    //     }
    // } catch (error) {
    //     console.error('Error handling SLUR_ADDED request:', error);
    // }

    //Crowdsourcing Slur

    const user = await getUserData();
    if (!user) {
        window.alert(`Please login to Uli Browser Extension to contribute`);
        return;
    }
    const crowdsourceData = {
        label: slur,
        page_url: page_url
    };
    try {
        // await createSlurAndCategory(user.accessToken, crowdsourceData);
        await createCrowdsourceSlur(crowdsourceData, user.token);
        console.log('finsihed POST req');
        window.alert(`Slur word "${slur}" added to Uli`);
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener(
    'load',
    async () => {
        console.log('content loaded');
        const pref = await getPreferenceData();
        const { enableSlurReplacement, enableSlurMetadata } = pref;

        // Initialize Slurs on content load
        try {
            const response = await userBrowserRuntime.sendMessage({
                type: 'initializeSlurs'
            });
            const allSlurWords = response.allSlurWords;
            const allMetadata = response.allMetadata;

            await initializeSlurReplaceExpressions(allSlurWords);

            if (enableSlurMetadata) {
                let body = document.getElementsByTagName('body');
                let first_body = body[0];
                transformGeneral.processNewlyAddedNodesGeneral2(
                    first_body,
                    allMetadata
                );
            } else if (enableSlurReplacement) {
                processPage(location.href);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    },
    false
);
