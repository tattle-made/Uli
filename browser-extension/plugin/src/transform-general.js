import { replaceSlur } from './slur-replace';
import { log } from './logger';
import repository from './repository';
const { getPreferenceData } = repository;
const jsonData = require('../../api-server/assets/slur_metadata.json')

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
    let targetWords = [] ; 
    jsonData.forEach(slur => {
        const slurWord = Object.keys(slur)[0];
        targetWords.push(slurWord) ; 
        targetWords.push(slurWord.charAt(0).toUpperCase() + slurWord.slice(1)); 
    })
    let uliStore = []
    getAllTextNodes(firstBody, uliStore)
    abc = locateSlur(uliStore, targetWords)
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

function checkFalseTextNode(text, actualLengthOfText) {
    let totalNewlineAndWhitespaces = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === "\n" || text[i] === " " || text[i] === "\t") {
            totalNewlineAndWhitespaces++;
        }
    }
    return totalNewlineAndWhitespaces === actualLengthOfText;
}

// Function to recursively get all text nodes for a given node
function getAllTextNodes(node, uliStore) {
    if (node.nodeType === 3) { 
        if (!checkFalseTextNode(node.data, node.length)) {
            uliStore.push({ node: node, parent: node.parentNode });
        }
    } else {
        let children = Array.from(node.childNodes);
        children.forEach(child => getAllTextNodes(child, uliStore));
    }
}

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
        let store = uliStore[i];  
        let parentNode = store.parent
        let textnode = store.node
        let text = store.node.textContent
        let tempParent = document.createElement("span"); 
        tempParent.textContent = text;
        let slurs = [];
        let slurPresentInTempParent = false;
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
                slurPresentInTempParent = true;
            }
        })
        uliStore[i].nodeToParent = tempParent
        uliStore[i].slurs = slurs;

        //O(1) complexity
        if (slurPresentInTempParent) {
            textnode.replaceWith(tempParent)
        }
    }
    return uliStore;
}

function addMetaData(targetWords) {
    targetWords.forEach(targetWord => {
        const className = `icon-container-${targetWord}`
        const elements = Array.from(document.querySelectorAll(`.${className}`))
        elements.forEach(element => {

            let sup = document.createElement("sup");
            let img = document.createElement("img");
            img.style.height = "1.5%"
            img.style.width = "1.5%"
            img.style.border = "1px solid black"
            img.style.cursor = "pointer"

            img.src = "https://raw.githubusercontent.com/tattle-made/Uli/main/uli-website/src/images/favicon-32x32.png"
            img.alt = "altText"

            let span = document.createElement("span")
            span.style.display = "none"
            span.style.position = "absolute"
            span.style.backgroundColor = "antiquewhite"
            span.style.border = "1px solid black"
            span.style.borderRadius = "12px"
            span.style.padding = "2px 6px"
            span.style.width = "16rem"
            span.style.textAlign = "justify"
            span.style.fontWeight = "lighter"
            span.style.color = "black"
            span.style.zIndex = "1000000000"; // This ensures it appears above other elements
            span.style.fontSize = "14px"
            span.style.textDecoration = "none"
            span.style.fontStyle = "normal"
            span.innerHTML = `${targetWord} is an offensive word`


            jsonData.forEach(slur => {
                const slurWord = Object.keys(slur)[0]; 
                if (slurWord.toLowerCase() === targetWord.toLowerCase()) {
                    const slurDetails = slur[slurWord]; 
                    let levelOfSeverity = slurDetails["Level of Severity"] ; 
                    let casual = slurDetails["Casual"] ; 
                    let approapriated = slurDetails["Appropriated"] ; 
                    let reason = slurDetails["If, Appropriated, Is it by Community or Others?"] ; 
                    let problematic = slurDetails["What Makes it Problematic?"]; 
                    let categories = slurDetails["Categories"] ;
                    let htmlContent = `` ; 
                    if(levelOfSeverity){
                        htmlContent += `<p><span class="label"><b>Level of Severity:</b></span> ${levelOfSeverity}</p>`
                    }
                    if(casual){
                        htmlContent += `<p><span class="label"><b>Casual:</b></span> ${casual}</p>`
                    }
                    if(approapriated){
                        htmlContent += `<p><span class="label"><b>Appropriated:</b></span> ${approapriated}</p>`
                    }
                    if(reason){
                        htmlContent += `<p><span class="label"><b>If, Appropriated, Is it by Community or Others?:</b></span> ${reason}</p>`
                    }
                    if(problematic){
                        htmlContent += `<p><span class="label"><b>What Makes it Problematic?:</b></span> ${problematic}</p>`
                    }
                    if(categories.length > 0){
                        htmlContent += `<p><span class="label"><b>Categories:</b></span> ${slurDetails["Categories"].join(', ')}</p>`
                    }
                    span.innerHTML = htmlContent;
                }
            });
                

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

export default {
    processNewlyAddedNodesGeneral,
    processNewlyAddedNodesGeneral2,
    addMetaData, 
    locateSlur, 
    findPositions, 
    getAllTextNodes, 
    checkFalseTextNode 
};



