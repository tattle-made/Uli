/**
 * parser is responsible for
 * 1. Parsing the DOM and converting it into structured tweet objects
 */

import { log } from '../logger';



/**
 * Parses the DOM and extracts structured data from it.
 * @param {DOMElement obtained from document.getElementById query} tweetDom
 * @return {Object} Tweet - stuctured tweet with values extracted from the dom
 */
function parseTweet_v2(id, tweetDom) {
    // const TWEET_PATH_GENERAL = new RegExp(
    //     'ARTICLE\\(0\\):DIV\\(0\\):DIV\\(1\\):DIV\\(1\\):DIV\\(1\\):DIV\\([0-9]+\\):DIV\\(0\\):DIV\\([0-9]+\\):DIV\\([0-9]+\\):SPAN'
    // );
    // const TWEET_PATH_GENERAL_TIMESTAMP = new RegExp(
    //     'DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):ARTICLE\\(0\\):DIV\\(0\\):DIV\\(1\\):DIV\\(1\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):DIV\\(2\\):DIV\\(0\\):A\\(0\\):TIME'
    // );
    // const TWEET_PATH_MAIN = new RegExp(
    //     'DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):ARTICLE\\(0\\):DIV\\(0\\):DIV\\(2\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):SPAN'
    // );
    // const TWEET_PATH_MAIN_TIMESTAMP = new RegExp(
    //     'DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):ARTICLE\\(0\\):DIV\\(0\\):DIV\\(2\\):DIV\\(3\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):A\\(0\\):SPAN'
    // );

    // const TWEET_PATH_CLICKED = new RegExp(
    //     'DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):ARTICLE\\(0\\):DIV\\(0\\):DIV\\(2\\):DIV\\(1\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):SPAN'
    // );
    // const TWEET_PATH_CLICKED_TIMESTAMP = new RegExp(
    //     'DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):ARTICLE\\(0\\):DIV\\(0\\):DIV\\(2\\):DIV\\(4\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):DIV\\(0\\):A\\(0\\):SPAN'
    // );
    // let leaf = {
    //     id,
    //     tweet_url: undefined,
    //     original_text: [],
    //     spans: []
    // };

    // function DFT(node, currentPath) {
    //     let elementTag = node.tagName;
    //     if (elementTag == undefined) {
    //         elementTag = 'UND';
    //     }
    //     node.childNodes.forEach((a, ix) => {
    //         const newCurrentPath = currentPath + `(${ix})` + ':' + elementTag;
    //         DFT(a, newCurrentPath);
    //     });
    //     if (
    //         node.childNodes.length === 0 &&
    //         (elementTag === 'SPAN' ||
    //             elementTag === 'A' ||
    //             elementTag === 'UND')
    //     ) {
    //         if (TWEET_PATH_GENERAL.test(currentPath)) {
    //             const parentElement = node.parentElement;
    //             parentElement.setAttribute('id', id);
    //             leaf.original_text.push(parentElement.innerText);
    //             leaf.spans.push(parentElement);
    //             log('General Tweet Leaf Identified', node);
    //         }
    //         if (TWEET_PATH_GENERAL_TIMESTAMP.test(currentPath)) {
    //             leaf.tweet_url = node.parentElement.parentElement.href;
    //             log('General Tweet Timestamp Leaf Identified', node);
    //         }

    //         if (TWEET_PATH_MAIN.test(currentPath)) {
    //             const parentElement = node.parentElement;
    //             parentElement.setAttribute('id', id);
    //             leaf.original_text.push(parentElement.innerText);
    //             leaf.spans.push(parentElement);
    //             log('Main Tweet Leaf Identified', node);
    //         }
    //         if (TWEET_PATH_MAIN_TIMESTAMP.test(currentPath)) {
    //             leaf.tweet_url = node.parentElement.parentElement.href;
    //             log('Main Tweet Timestamp Leaf Identified', node);
    //         }

    //         if (TWEET_PATH_CLICKED.test(currentPath)) {
    //             const parentElement = node.parentElement;
    //             parentElement.setAttribute('id', id);
    //             leaf.original_text.push(parentElement.innerText);
    //             leaf.spans.push(parentElement);
    //             log('Main Tweet Leaf Identified', node);
    //         }
    //         if (TWEET_PATH_CLICKED_TIMESTAMP.test(currentPath)) {
    //             leaf.tweet_url = node.parentElement.parentElement.href;
    //             log('Main Tweet Timestamp Leaf Identified', node);
    //         }
    //     }
    // }

    // DFT(tweetDom, 'DIV');
    const tweet = tweetDom.querySelectorAll('[data-testid="tweetText"]');
    log(tweet);
    // childTweet = tweet.childNodes[0];
    return tweet;
    // tweet.setAttribute('id', id);
    // leaf.original_text.push(tweet.innerText);
    // leaf.spans.push(tweet);
    // log('General Tweet Leaf Identified', tweet);
    // leaf.tweet_url = tweet.parentElement.href;
    // log('General Tweet Timestamp Leaf Identified', tweet);
    // return leaf;
}

export { parseTweet_v2 };
