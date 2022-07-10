/**
 * dom is responsible for
 * 1. DOM editing - adding divs, editing classes and attributes etc
 * 2. Registering event handlers
 */

import ReactDOM from 'react-dom';
import { InlineButtons } from '../ui-components/pages/InlineButtons';
import { pages, getPageType } from './pages';

// global variable to store parsed tweets on the current page.
let tweets = {};

/**
 * This function finds the DOMElement for timeline irrespective of the
 * page location
 */
function findTimeline(url) {
    let pageType = getPageType(url);
    if (pageType === pageType.UNSUPPORTED) {
        return undefined;
    } else {
        let page = pages[pageType];
        let timeline = page.findTimeline();
        return timeline;
    }
}

function createTopBannerElement() {
    try {
        let main = document.getElementsByTagName('main')[0];
        var inlineButtonDiv = document.createElement('div');
        inlineButtonDiv.id = 'ogbv-inline-button';
        main.prepend(inlineButtonDiv);
        ReactDOM.render(
            <InlineButtons style={{ position: 'sticky', top: 0 }} />,
            inlineButtonDiv
        );
    } catch (err) {
        console.log('TEST : Error Creating Top Banner', err);
    }
}

function getTopBannerElement() {
    return document.getElementById('ogbv-inline-button');
}

function setOnChangeListener(timeline, onChange) {
    console.log({ TIMELINE: timeline, onChange });
    const onMutation = async function (mutationsList) {
        console.log('process tweets');
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (mutation.addedNodes.length != 0) {
                    console.log('A child node has been added');
                    onChange(mutation.addedNodes);
                }
            } else if (mutation.type === 'attributes') {
                // console.log("The " + mutation.attributeName + " attribute was modified.");
            }
        }
    };
    const observer = new MutationObserver(onMutation);
    const config = { attributes: true, childList: true, subtree: false };
    observer.observe(timeline, config);
    // debugger;
}

export default {
    createTopBannerElement,
    getTopBannerElement,
    setOnChangeListener,
    tweets,
    findTimeline
};
