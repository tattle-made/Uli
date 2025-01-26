import { dom } from './twitter';
import { current } from './twitter/pages';
const { setOnChangeListener } = dom;
import transform_v2 from './transform-v2';
import { log } from './logger';
import repository from './repository';
const { getUserData, getPreferenceData, setPreferenceData } = repository;
import transformGeneral from './transform-general';
import Api from './ui-components/pages/Api';
import {
    initializeSlurs,
    getSlursBySource,
    addSlur,
    deleteSlur,
    slurExists,
    bulkAddSlurs,
    convertSlurMetadataFromDBtoJSON
} from './slur-store';
import { createCrowdsourceSlur } from './api/crowdsource-slurs';
import { getPublicSlurs } from './api/public-slurs';

const { createSlurAndCategory } = Api;

log('Content Script Loaded Test 2');

// test function to log variables in console
(async function test() {
    console.log('Async Test');
    // const data = await axios.get("http://localhost:3000/");
    // console.log("api test data", data);
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
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        case 'updateData':
            handleMessageUpdateData();
            return true;
        case 'fetchPersonalSlurs':
            handleMessageFetchPersonalSlurs(request, sendResponse);
            return true;
        case 'syncApprovedCrowdsourcedSlurs':
            return handleMessageSyncApprovedSlurs();
        case 'SLUR_ADDED':
            return handleMessageSlurAdded(request);
        case 'ULI_ENABLE_SLUR_REPLACEMENT':
            if (!request.payload) {
                clearInterval(mainLoadedChecker);
            }
        case 'URL_CHANGED':
            return processPage(location.href);
        default:
            return false;
    }
});

async function handleMessageSyncApprovedSlurs(request, sendResponse) {
    const source = 'public_crowdsourced_slurs';
    try {
        const publicSlurs = await getPublicSlurs();
        const publicSlursArray = publicSlurs.map((slur) => slur.label);
        // console.log(publicSlursArray);

        const filteredSlurs = [];
        for (const slur of publicSlursArray) {
            const exists = await slurExists(slur, source);
            if (!exists) {
                filteredSlurs.push(slur);
            }
        }
        // If there are slurs to add, bulk add them to the database
        if (filteredSlurs.length > 0) {
            await bulkAddSlurs(filteredSlurs, source);
        } else {
            console.log('No new slurs to add.');
        }
        return true;
    } catch (error) {
        console.error('Error fetch public crowsrouced slurs');
        return false;
    }
}

async function handleMessageUpdateData(request) {
    try {
        const newSlurs = request.data;
        console.log('New slurs received:', newSlurs);
        // fetch exisiting slurs
        const existingSlurs = (await getSlursBySource('personal')).map(
            (slur) => slur.word
        );
        // Add new slurs to the database
        for (const slur of newSlurs) {
            if (!existingSlurs.includes(slur)) {
                await addSlur(slur, 'personal');
            }
        }
        // Remove slurs from the database that no longer exist in the new list
        for (const slur of existingSlurs) {
            if (!newSlurs.includes(slur)) {
                await deleteSlur(slur, 'personal');
            }
        }
        processPage(location.href);
    } catch (error) {
        console.error('Error during updating slur list:', error);
    }
}

async function handleMessageFetchPersonalSlurs(request, sendResponse) {
    try {
        console.log('fetching personal slurs');
        getSlursBySource('personal').then((personalSlurs) => {
            const slurArr = personalSlurs.map((slur) => slur.word);
            console.log('sending personal slurs', slurArr);
            sendResponse(slurArr);
        });
        return true;
    } catch (error) {
        console.error(
            'Error fetching personal slurs in content script:',
            error
        );
    }
}

async function handleMessageSlurAdded(request) {
    const slur = request.slur;
    log('slur added from bg', slur);
    let slurList;

    const user = await getUserData();
    // console.log('USER in content-script', user);
    const crowdsourceData = {
        label: slur
    };

    // Adding Slur to IndexedDB
    try {
        const exists = await slurExists(slur, 'personal');

        if (!exists) {
            await addSlur(slur, 'personal');
            log('Slur added to IndexedDB:', slur);
        } else {
            log('Slur already exists in IndexedDB, skipping:', slur);
        }
    } catch (error) {
        console.error('Error handling SLUR_ADDED request:', error);
    }

    //Crowdsourcing Slur
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
        await initializeSlurs();

        if (enableSlurMetadata) {
            let body = document.getElementsByTagName('body');
            let first_body = body[0];
            const jsonData = await convertSlurMetadataFromDBtoJSON();
            transformGeneral.processNewlyAddedNodesGeneral2(
                first_body,
                jsonData
            );
        } else if (enableSlurReplacement) {
            processPage(location.href);
        }
    },
    false
);
