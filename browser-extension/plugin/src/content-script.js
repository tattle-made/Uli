import { dom } from './twitter';
import { current } from './twitter/pages';
const { setOnChangeListener } = dom;
import transform from './transform';
import { log } from './logger';
import repository from './repository';
const { getPreferenceData } = repository;
import { updateSlurList } from './slur-replace';

log('Content Script Loaded');

function processPage(newUrl) {
    var mainLoadedChecker = setInterval(() => {
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
                transform.processNewlyAddedNodes(timeline.children);
                setOnChangeListener(timeline, transform.processNewlyAddedNodes);
            }
            clearInterval(mainLoadedChecker);
        } else {
            console.log('main section loaded');
        }
    }, 500);
}

/**
 * This Listens to any changed on the URL
 * eg : When a user clicks on a tweet on their home timeline, they
 * go from the home page to the user status page.
 */
chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === 'URL_CHANGED') {
        const newUrl = request.url;
        log('Url Changed', newUrl);
        processPage(location.href);
    }
});

chrome.runtime.onMessage.addListener(async function (message) {
    if (message.type === 'updateData') {
        console.log('data changed. time to update slurs');
        const preference = await getPreferenceData();
        console.log(preference);
        if (preference.slurList != undefined) {
            updateSlurList(preference.slurList);
            processPage(location.href);
        }
    }
});

window.addEventListener(
    'load',
    () => {
        console.log('content loaded');
        processPage(location.href);
    },
    false
);
