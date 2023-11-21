import { createRoot } from 'react-dom/client';
//import { parseTweet } from './twitter/parser';
import { parseTweet_v2 } from './twitter/parser-v2';
import { hashCode } from './util';
import { replaceSlur } from './slur-replace';
import { TweetControl } from './twitter/tweet-controls';
import { log } from './logger';

let tweets = {};

function debug(id) {
    console.log(id, tweets[id]);
    // unblur(id);
}

function setBlur(id, blurFlag) {
    if (blurFlag === true) {
        const tweetToUnBlur = tweets[id];
        for (let i = 0; i < tweetToUnBlur.spans.length; i++) {
            tweetToUnBlur.spans[i].innerText = tweetToUnBlur.original_text[i];
        }
    } else {
        const tweetToBlur = tweets[id];
        for (let i = 0; i < tweetToBlur.spans.length; i++) {
            tweetToBlur.spans[i].innerText = replaceSlur(
                tweetToBlur.spans[i].innerText
            );
        }
    }
}

function addInlineMenu(id, item, hasSlur) {
    // const id = `ogbv_tweet_${Math.floor(Math.random() * 999999)}`;
    // const id = hashCode(item.innerHTML);

    item.setAttribute('id', id);

    let inlineButtonDiv = document.createElement('div');
    inlineButtonDiv.id = id;
    item.prepend(inlineButtonDiv);
    let root = createRoot(inlineButtonDiv);

    root.render(
        <TweetControl
            tweet={tweets[id]}
            id={id}
            debug={debug}
            setBlur={setBlur}
            hasSlur={hasSlur}
        />
    );
}

const processNewlyAddedNodes_v2 = function (addedNodes) {

    // code for leaf

    let leaf = {
        id: undefined,
        tweet_url: undefined,
        original_text: [],
        spans: []
    };

    //code for leaf ends

    log('processing new nodes');
    const nodes = Array.from(addedNodes);
    nodes.map((node) => {
        log('node', node);
        const id = hashCode(node.innerHTML);
        const output = parseTweet_v2(id, node); //renamed tweet to output -- assumed to be leaf
        for (const individualTweet of output) {
            individualTweet.setAttribute('id', id);
            leaf.original_text.push(individualTweet.innerText);
            leaf.spans.push(individualTweet);
            log('General Tweet Leaf Identified', individualTweet);
            leaf.tweet_url = individualTweet.parentElement.href;
            log('General Tweet Timestamp Leaf Identified', individualTweet);
                
            tweets[id] = leaf;
            let hasSlur = false;
            for (const tweet of tweets[id].spans) {
                const text = tweet.innerText;
                const replacementText = replaceSlur(text);
                tweet.innerText = replacementText;
                if (text !== replacementText) {
                    hasSlur = true;
                }
            }
            if (
                leaf.spans.length > 0 &&
                node.getElementsByClassName('ogbv-tweetcontrol-bar').length == 0
            ) {
                addInlineMenu(id, node, hasSlur);
            }
        }
        // if (
        //     tweet.spans.length > 0 &&
        //     node.getElementsByClassName('ogbv-tweetcontrol-bar').length == 0
        // ) {
        //     addInlineMenu(id, node, hasSlur);
        // }
    });
};

export default {
    processNewlyAddedNodes_v2
};

