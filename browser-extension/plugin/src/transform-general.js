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

// Traverse dom nodes to find leaf node that are text nodes and process
function bft(nodes){
    // console.log("inside bft");
    if(nodes.childNodes.length===0 && nodes.nodeType === 3){ 
        // console.log("found leaf text node", nodes);
        // console.log(nodes.textContent);
        const replacementText = replaceSlur(nodes.textContent);
        nodes.textContent = nodes.textContent.replace(nodes.textContent, replacementText)
    }
    else if(nodes.nodeName != "STYLE" && nodes.nodeName != "SCRIPT" && nodes.nodeName != "NOSCRIPT") {
        // console.log(nodes.nodeName)
        nodes.childNodes.forEach((nodes)=>bft(nodes))
    }
}

const processNewlyAddedNodesGeneral = function (firstBody) {
    log('processing new nodes');
    const config = { attributes: true, childList: true, subtree: true };
    
    const callback = (mutationList, observer) => {
        let elems = firstBody.children
        const nodes = Array.from(elems);
        let relevant_elements = nodes.filter((element)=>["P","DIV"].includes(element.nodeName))
        
        relevant_elements.map((element) => {
            bft(element)
        });
    }
    const observer = new MutationObserver(callback);
    observer.observe(firstBody, config); 
    
};

export default {
    processNewlyAddedNodesGeneral
};
