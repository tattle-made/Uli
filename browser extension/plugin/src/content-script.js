import { updateSlurList } from './slur-replace';
import { dom } from './twitter';
import { current } from './twitter/pages';
import repository from './repository';
const { getPreferenceData } = repository;
const { createTopBannerElement, setOnChangeListener } = dom;
import transform from './transform';

console.log('TEST : CS loaded');

if (process.env.ENVIRONMENT) {
    console.log(`Content Script Loaded : ${process.env.ENVIRONMENT}`);
}

setTimeout(async () => {
    await initialize();
}, 5000);

async function initialize() {
    createTopBannerElement();

    const preference = await getPreferenceData();

    if (preference != undefined && preference.slurList != undefined) {
        updateSlurList(preference.slurList);
    }

    // process page
}

function handleNewPage(newUrl) {
    // processExistingNodes();
    let currentPage = current(newUrl);
    console.log({ currentPage });
    const { page } = currentPage;
    const { getTimeline } = page;

    if (getTimeline === undefined) {
        console.log('UNKNOWN STATE : could not find timeline');
        // todo : this is where we should default to basic slur replacement
    } else {
        // debugger;
        let timeline = getTimeline();
        transform.processNewlyAddedNodes(timeline.children);
        setOnChangeListener(timeline, transform.processNewlyAddedNodes);
    }
}

chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === 'URL_CHANGED') {
        console.log({ status: request.status });
        const newUrl = request.url;
        setTimeout(async () => {
            handleNewPage(newUrl);
        }, 1500);
    }
});

const targetNode = document.getElementsByTagName('main')[0];
const config = { attributes: true, childList: true, subtree: true };

const callback = function (mutationsList) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // console.log('A child node has been added or removed.');
            // console.log(mutation.addedNodes);
            const nodes = Array.from(mutation.addedNodes);
            nodes.map((node) => {
                if (node.tagName === 'SECTION') {
                    console.log('section loaded');
                    handleNewPage(location.href);
                }
            });
        }
    }
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
