import { dom } from './twitter';
import { current } from './twitter/pages';
const { setOnChangeListener } = dom;
import transform_v2 from './transform-v2';
import { log } from './logger';
import repository from './repository';
const { getUserData, getPreferenceData, setPreferenceData } = repository;
// import { updateSlurList } from './slur-replace';
import transformGeneral from './transform-general';
import Api from './ui-components/pages/Api';
import { initializeSlurs, getSlursBySource } from './slur-store';
import { createCrowdsourceSlur } from './api/crowdsource-slurs';

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
 * This Listens to any changed on the URL
 * eg : When a user clicks on a tweet on their home timeline, they
 * go from the home page to the user status page.
 */
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    console.log("msg gotten", request);
    console.log(sendResponse);
    console.log(sender);
    if (request.type === 'updateData') {
        try {
            console.log("reached content update data");
            // processPage(location.href);
        } catch (error) {
            console.error('Error during updating slur list:', error);
        }
        return true;
    }
    if (request.type === 'fetchPersonalSlurs') {
        console.log("inside fetch content personal");
        try {
            const personalSlurs = await getSlursBySource('personal');
            const slurArr = personalSlurs.map((slur) => slur.word);
            console.log('Sending slurs back to pref:', slurArr);
            // sendResponse({msg: 23});
            return {msg: 20};
        } catch (error) {
            console.error('Error fetching personal slurs in content script:', error);
            // sendResponse({ success: false, error: error.message });
            return {msg: 21};
        }
        return {msg: 22};
    }
    if (request.message === 'URL_CHANGED') {
        const newUrl = request.url;
        log('Url Changed', newUrl);
        processPage(location.href);
        return true;
    }
    if (request.type === 'SLUR_ADDED') {
        const slur = request.slur;
        log('slur added from bg', slur);
        const pref = await getPreferenceData();
        let slurList;

        const user = await getUserData();
        // console.log('USER in content-script', user);
        const crowdsourceData = {
            label: slur,
        };

        // Adding Slur to Prefrences
        if (!pref || !pref.slurList) {
            slurList = slur;
        } else {
            slurList = pref.slurList;
            if (!slurList || slurList === '') {
                slurList = slur;
            } else {
                slurList += `,${slur}`;
            }
        }
        try {
            await setPreferenceData({ ...pref, slurList });
        } catch (error) {
            console.error('error updating pref data', error);
        }

        //Crowdsourcing Slur
        try {
            // await createSlurAndCategory(user.accessToken, crowdsourceData);
            await createCrowdsourceSlur(crowdsourceData, user.token)
            console.log('finsihed POST req');
            window.alert(`Slur word "${slur}" added to Uli`);
        } catch (error) {
            console.log(error);
        }

        return true;
    }

    if (request.type === 'ULI_ENABLE_SLUR_REPLACEMENT') {
        console.log('Toggle change event received', request.payload);
        if (!request.payload) {
            clearInterval(mainLoadedChecker);
        }
    }
});

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
            transformGeneral.processNewlyAddedNodesGeneral2(first_body);
        } else if (enableSlurReplacement) {
            processPage(location.href);
        }
    },
    false
);
