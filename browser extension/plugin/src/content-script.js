import { dom } from './twitter';
import { current } from './twitter/pages';
const { setOnChangeListener } = dom;
import transform from './transform';
import { log } from './logger';

log('Content Script Loaded');

// setTimeout(async () => {
//     processPage(location.href);
// }, 5000);

// async function initialize() {
//     createTopBannerElement();

//     const preference = await getPreferenceData();

//     if (preference != undefined && preference.slurList != undefined) {
//         updateSlurList(preference.slurList);
//     }

//     // process page
// }

function processPage(newUrl) {
    let currentPage = current(newUrl);
    log({ currentPage });
    const { page } = currentPage;
    const { getTimeline } = page;

    if (getTimeline === undefined) {
        log('Unknown State. Could not find Timeline');
    } else {
        let timeline = getTimeline();
        log({ timeline });
        transform.processNewlyAddedNodes(timeline.children);
        setOnChangeListener(timeline, transform.processNewlyAddedNodes);
    }
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
        setTimeout(async () => {
            processPage(location.href);
        }, 2000);
    }
});

const targetNode = document.getElementsByTagName('main')[0];
const config = { attributes: true, childList: true, subtree: true };

const callback = function (mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            log('A child node has been added or removed.');
            const nodes = Array.from(mutation.addedNodes);
            nodes.map((node) => {
                if (node.tagName === 'SECTION') {
                    log('Section Loaded', node);
                    setTimeout(async () => {
                        processPage(location.href);
                    }, 500);
                }
            });
        }
    }
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
