import { dom } from './twitter';
import { current } from './twitter/pages';
const { setOnChangeListener } = dom;
import transform_v2 from './transform-v2';
import { log } from './logger';
import repository from './repository';
const { getUserData, getPreferenceData, setPreferenceData } = repository;
import { updateSlurList } from './slur-replace';
import transformGeneral from './transform-general';
import Api from './ui-components/pages/Api';

const { createSlurAndCategory } = Api;

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
 * This Listens to any changed on the URL
 * eg : When a user clicks on a tweet on their home timeline, they
 * go from the home page to the user status page.
 */
chrome.runtime.onMessage.addListener(async function (request) {
    if (request.type === 'updateData') {
        console.log('data changed. time to update slurs');
        const preference = await getPreferenceData();
        console.log(preference);
        if (preference.slurList != undefined) {
            updateSlurList(preference.slurList);
            processPage(location.href);
        }
        return true;
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
        await setPreferenceData({ ...pref, slurList });
        return true;
    }
    if (request.type === 'CROWDSOURCE_SLUR_WORD') {
        const crowdsource_slur = request.crowdsourcedSlur;
        console.log('crowdsourced slur from bg = ', crowdsource_slur);
        const user = await getUserData();
        const crowdsourceData = {
            label: crowdsource_slur,
            categories: []
        };
        try {
            await createSlurAndCategory(user.accessToken, crowdsourceData);
            console.log('finsihed POST req');
        } catch (error) {
            console.log(error);
        }
    }
    if (request.type === 'ULI_ENABLE_TOGGLE') {
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
        console.log(pref);
        const { uliEnableToggle } = pref;
        if (uliEnableToggle) {
            processPage(location.href);
        }
    },
    false
);
