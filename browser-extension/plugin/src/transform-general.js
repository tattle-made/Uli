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


const processNewlyAddedNodesGeneral2 = function (firstBody) {

            console.log("HEY THERE !!!")
            let targetWords = ["stupid", "crazy", "Crazy", "mad", "Mad", "MAD"]
            let uliStore = []
            // getAllTextNodes(document.body, uliStore)
            getAllTextNodes(firstBody, uliStore)
            console.log(uliStore)
            abc = locateSlur(uliStore, targetWords)
            console.log("uliStore", abc)
            addMetaData(targetWords)
            
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
    let totalNewlineAndWhitespaces = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === "\n" || text[i] === " " || text[i] === "\t") {
            // I think not only \n and " " , if a textNode is comprised of any escape characters and whitespace, it should be a false textNode
            totalNewlineAndWhitespaces++;
        }
    }
    return totalNewlineAndWhitespaces === actualLengthOfText;
}


// Function to recursively get all text nodes under a given node
function getAllTextNodes(node, uliStore) {
    if (node.nodeType === 3) { // Text node
        if (!checkFalseTextNode(node.data, node.length)) {
            uliStore.push({ node: node, parent: node.parentNode });
        }
    } else {
        let children = Array.from(node.childNodes);
        children.forEach(child => getAllTextNodes(child, uliStore));
    }
}



/*                getAllTextNodes()  ENDS HERE                */


/*                 locateSlur()  STARTS HERE                  */

function findPositions(word, text) {
    let positions = {};

    let len = word.length
    let loc = []
    let index = text.toString().indexOf(word);
    while (index !== -1) {
        let obj = {};
        loc.push([index, index + len]);
        index = text.toString().indexOf(word, index + 1);
    }


    if (loc.length !== 0) {
        positions.slurText = word
        positions.slurLocation = loc;
    }
    return positions;
}



function locateSlur(uliStore, targetWords) {
    let n = uliStore.length;

    for (let i = 0; i < n; i++) {
        let store = uliStore[i];  //This will contain the textNode 
        let parentNode = store.parent
        let textnode = store.node
        let text = store.node.textContent
        let tempParent = document.createElement("span");  //I chose span over p because span is an inline element and p is a block element, injecting block
        //element would cause a lot of change in the stylings and can damage the overall webpage to a greater extent
        tempParent.textContent = text;

        let slurs = [];

        targetWords.forEach(targetWord => {
            let slurWord = targetWord;
            let pos = findPositions(slurWord, text);
            if (Object.keys(pos).length !== 0) {
                slurs.push(pos)
            }

            if (tempParent.innerHTML.includes(targetWord)) {
                const className = `icon-container-${targetWord}`;
                const parts = tempParent.innerHTML.split(targetWord);
                const replacedHTML = parts.join(`${targetWord}<span class="${className}"></span>`);
                tempParent.innerHTML = replacedHTML
            }
        })
        // for(let i = 0 ; i < )
        // console.log("tempParent " , tempParent)
        uliStore[i].nodeToParent = tempParent
        uliStore[i].slurs = slurs;

        //O(1) complexity
        parentNode.replaceChild(tempParent, textnode)

    }
    return uliStore; 
}


/*                    locateSlur()  ENDS HERE               */




/*                        addMetaData()  STARTS HERE           */

function addMetaData(targetWords) {
    targetWords.forEach(targetWord => {
        const className = `icon-container-${targetWord}`
        const elements = Array.from(document.querySelectorAll(`.${className}`))
        elements.forEach(element => {

            let sup = document.createElement("sup");

            let img = document.createElement("img");
            img.style.height = "3%"
            img.style.width = "3%"
            img.style.cursor = "pointer"
            img.src = "https://upload.wikimedia.org/wikipedia/commons/4/43/Minimalist_info_Icon.png"
            // img.src = "./info.png"
            img.alt = "altText"

            let span = document.createElement("span")
            span.style.display = "none"
            span.style.position = "absolute"
            span.style.backgroundColor = "antiquewhite"
            span.style.border = "1px solid black"
            span.style.borderRadius = "12px"
            span.style.padding = "2px 6px"
            span.style.width = "12rem"
            span.style.textAlign = "justify"
            span.innerHTML = `This is ${targetWord}`


            if (targetWord === "crazy") {
                span.innerHTML = `Referring to behaviors or situations as "crazy" can perpetuate stereotypes about mental health and may be hurtful to those with mental health conditions.`
            }
            else if (targetWord === "mad") {
                span.innerHTML = `Using "mad" to describe someone negatively can be insensitive, as it historically stigmatizes mental health issues and can imply irrationality or instability.`
            }
            else if (targetWord === 'stupid') {
                span.innerHTML = `Describing actions or decisions as "stupid" can be demeaning and hurtful, as it implies lack of intelligence or judgment, which can be offensive to individuals or groups.`
            }
            else {
                span.innerHTML = `This word is considered offensive or derogatory due to its association with negative stereotypes about people with disabilities. Using such terms can perpetuate discrimination and harm individuals by devaluing their worth and capabilities.`
            }


            sup.appendChild(img)
            sup.appendChild(span)

            element.append(sup)
            let sups = element.children[0]
            let spans = element.children[0].children[1]
            const svgs = element.children[0].children[0];
            svgs.addEventListener('mouseover', function () {
                sups.children[1].style.display = "inline-block"
            });

            svgs.addEventListener('mouseout', function () {
                sups.children[1].style.display = "none"
            });
        })
    })
}


/*                      addMetaData() ENDS HERE                  */




export default {
    processNewlyAddedNodesGeneral , 
    processNewlyAddedNodesGeneral2
};



