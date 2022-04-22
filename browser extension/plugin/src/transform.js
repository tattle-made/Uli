import ReactDOM from 'react-dom';
import { parseTweet } from './twitter/parser';
import { hashCode } from './util';
import { replaceSlur } from './slur-replace';
import { TweetControl } from './twitter/tweet-controls';

let tweets = {};

function debug(id) {
    console.log(tweets[id]);
    // unblur(id);
}

function setBlur(id, blurFlag) {
    console.log({ id, blurFlag });
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

function addInlineMenu(id, item) {
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
        />,
        inlineButtonDiv
    );
}

const processNewlyAddedNodes = function (addedNodes) {
    console.log('processing new nodes');
    const nodes = Array.from(addedNodes);
    nodes.map((node) => {
        console.log(node);
        const id = hashCode(node.innerHTML);
        const tweet = parseTweet(id, node);
        tweets[id] = tweet;

        for (const tweet of tweets[id].spans) {
            // console.log({ 2: tweet });
            const text = tweet.innerText;
            tweet.innerText = replaceSlur(text);
        }

        if (tweet.spans.length > 0) {
            addInlineMenu(id, node);
        }
    });
};

export default {
    processNewlyAddedNodes
};
