import ReactDOM from 'react-dom';
import { parseTweet } from './twitter/parser';
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

    ReactDOM.render(
        <TweetControl
            tweet={tweets[id]}
            id={id}
            debug={debug}
            setBlur={setBlur}
            hasSlur={hasSlur}
        />,
        inlineButtonDiv
    );
}

const processNewlyAddedNodesGeneral = function (addedNodes) {
    log('processing new nodes');
    const nodes = Array.from(addedNodes);
    nodes.map((node) => {
        // console.log(node)
        const text = node.innerText;
        // console.log(text)
        const replacementText = replaceSlur(text);
        node.innerText = replacementText;
             

        
    });
};

export default {
    processNewlyAddedNodesGeneral
};
