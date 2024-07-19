import { replaceSlur } from './slur-replace';
import { log } from './logger';
import repository from './repository';
const { getPreferenceData } = repository;

// Traverse dom nodes to find leaf node that are text nodes and process
function bft(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        const originalText = node.textContent;
        // Get cursor position
        const originalCursorPosition = getCaretCharacterOffsetWithin(node);
        const replacementText = replaceSlur(originalText);

        if (replacementText !== originalText) {
            node.textContent = replacementText;
            // Set cursor position
            setCaretPosition(node, originalCursorPosition);
        }
    } else if (
        node.nodeName !== 'STYLE' &&
        node.nodeName !== 'SCRIPT' &&
        node.nodeName !== 'NOSCRIPT'
    ) {
        node.childNodes.forEach(bft);
    }
}

// Function to get the cursor position within a node
function getCaretCharacterOffsetWithin(element) {
    let caretOffset = 0;
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
}

// Function to set the cursor position within a node
function setCaretPosition(element, offset) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(element, offset);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

const processNewlyAddedNodesGeneral = function (firstBody) {
    log('processing new nodes');
    const config = { attributes: true, childList: true, subtree: true };

    const callback = async () => {
        const pref = await getPreferenceData();
        const { enableSlurReplacement } = pref;
        if (enableSlurReplacement) {
            let elems = firstBody.children;
            const nodes = Array.from(elems);
            let relevant_elements = nodes.filter((element) =>
                ['P', 'DIV'].includes(element.nodeName)
            );

            relevant_elements.map((element) => {
                bft(element);
            });
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(firstBody, config);
};


// Code inserted below is for uliStore


/*           getAllTextNodes()  STARTS HERE        */

function checkFalseTextNode(text, actualLengthOfText) {
    let n = text.length;
    let totalNewlineAndWhitespaces = 0;
    for (let i = 0; i < n; i++) {
        if (text[i] === "\n") {
            totalNewlineAndWhitespaces += 1;
        }

        else if (text[i] === " ") {
            totalNewlineAndWhitespaces += 1;
        }

    }
    if (totalNewlineAndWhitespaces === actualLengthOfText) {
        //False Text Node Confirmed
        return true;
    }
    else {
        //True Text Node Confirmed
        return false;
    }
}


function getAllTextNodes(node) {
    let uliStore = []
    if (node.nodeType === 3) {
        //If node.data contains just whitespaces and \n, then its a false text node

        // let whitespaces = (node.data.split(" ").length - 1);
        // console.log(node.data) ; 
        if (checkFalseTextNode(node.data, node.length) === false) {
            uliStore.push({ node: node, parent: node.parentNode });
        }
        // textNodes.push({ node: node, parent: node.parentNode });
        return;
    }

    let children = Array.from(node.childNodes);
    for (let i = 0; i < children.length; i++) {
        getAllTextNodes(children[i]);
    }

    return uliStore ; 
}


/*                getAllTextNodes()  ENDS HERE                */


/*                 locateSlur()  STARTS HERE                  */

function findPositions(word, text) {
    let positions = {};
    
    let len = word.length
    let loc = []
    let index = text.toString().indexOf(word);
    while (index !== -1) {
        let obj = {} ; 
        loc.push([index , index + len]);
        index = text.toString().indexOf(word, index + 1);
    }
    

    if(loc.length !== 0){
        positions.slurText = word 
        positions.slurLocation = loc ;
    }
    return positions;
}


function locateSlur(uliStore, targetWords){
    let n = uliStore.length ;

    for(let i = 0 ; i < n ; i++){
        let store = uliStore[i] ;  //This will contain the textNode 
        let parentNode = store.parent 
        let text = store.node.textContent
        //We have to look into this store for all the slurWords 
        let slurs = [] ; 

        targetWords.forEach(targetWord => {
            let slurWord = targetWord ;
            let pos = findPositions(slurWord , text) ;
            if(Object.keys(pos).length !== 0){
                slurs.push(pos)
            }
        })
        uliStore[i].slurs = slurs ; 
    }
    return uliStore ; //This will return the final uliStore (after appending slurs)
}


/*                    locateSlur()  ENDS HERE               */



export default {
    processNewlyAddedNodesGeneral
};



