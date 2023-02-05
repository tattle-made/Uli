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
    
    const tweet = tweetDom.querySelectorAll('[data-testid="tweetText"]'); // selects all elements that have 'tweetText' as the value of the data-testid attribute
    // log(tweet); 
    
    return tweet; // returns an array of all tweet text containing DIVs
    
}

export { parseTweet_v2 };
