import { replaceSlur } from './slur-replace';
import { log } from './logger';
import repository from './repository';
const { getPreferenceData } = repository;
import { createRoot } from 'react-dom/client';
import HoverSlurMetadata from './ui-components/atoms/HoverSlurMetadata';

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

const processNewlyAddedNodesGeneral2 = function (firstBody, jsonData) {
    let targetWords = jsonData.map((slur) => Object.keys(slur)[0]);
    targetWords.sort((a, b) => b.length - a.length);

    let uliStore = [];
    getAllTextNodes(firstBody, uliStore);

    locateSlur(uliStore, targetWords, jsonData);
    // addMetaData(targetWords, jsonData);

    const ob = new MutationObserver(async (mutations) => {
        // console.log('NEW MUTATIONs: ', mutations);

        setTimeout(() => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes) {
                    mutation.addedNodes.forEach((node) => {
                        let uliStore = [];
                        getAllTextNodes(node, uliStore);
                        locateSlur(uliStore, targetWords, jsonData);
                        // addMetaData(targetWords, jsonData);
                    });
                }
            });
        }, 10);
    });

    ob.observe(firstBody, { childList: true, subtree: true });
};

function checkFalseTextNode(text, actualLengthOfText) {
    let totalNewlineAndWhitespaces = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '\n' || text[i] === ' ' || text[i] === '\t') {
            totalNewlineAndWhitespaces++;
        }
    }
    return totalNewlineAndWhitespaces === actualLengthOfText;
}

function getAllTextNodes(node, uliStore) {
    if (node.nodeType === 3) {
        if (!checkFalseTextNode(node.data, node.length)) {
            uliStore.push({ node: node, parent: node.parentNode });
        }
    } else {
        let children = Array.from(node.childNodes);
        children.forEach((child) => getAllTextNodes(child, uliStore));
    }
}

function findPositions(word, text) {
    let positions = {};
    let len = word.length;
    let loc = [];
    let index = text.toString().indexOf(word);
    while (index !== -1) {
        let obj = {};
        loc.push([index, index + len]);
        index = text.toString().indexOf(word, index + 1);
    }
    if (loc.length !== 0) {
        positions.slurText = word;
        positions.slurLocation = loc;
    }
    return positions;
}

function locateSlur(uliStore, targetWords, jsonData) {
    // console.log('INSIDE LOCATE SLUR');
    // console.log('INSIDE LOCATE SLUR< ULI STORE: ', uliStore);
    if (uliStore.length === 0) return;
    uliStore.forEach((store) => {
        let textnode = store.node;
        // console.log('STORE ENTRY', store);
        if (
            store.parent?.classList.contains('slur') ||
            store.parent?.innerHTML.includes(`class="slur`)
        ) {
            console.log('HERE inside IF', store.parent);
            return;
        }
        let tempParent = document.createElement('span');
        tempParent.textContent = textnode.textContent;
        let slurPresentInTempParent = false;
        let foundTargettedWord = '';
        targetWords.forEach((targetWord) => {
            const sanitizedTargetWord = targetWord.replace(/\s+/g, '-');
            const slurClass = `slur-container-${sanitizedTargetWord}`;

            const escapedTargetWord = targetWord.replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&'
            );
            // regex for multi-word and single-word phrases
            const regex = new RegExp(
                `(^|\\s|[.,!?])(${escapedTargetWord})(?=\\s|$|[.,!?])`,
                'giu'
            );

            if (regex.test(tempParent.textContent)) {
                tempParent.innerHTML = tempParent.innerHTML.replace(
                    regex,
                    (match, prefix, word) => {
                        return `${prefix}<span class="${slurClass}"><span class="slur">${word}</span></span>`;
                    }
                );
                slurPresentInTempParent = true;
                foundTargettedWord = targetWord;
            }
        });

        if (slurPresentInTempParent) {
            textnode.replaceWith(tempParent);
            // console.log('REPLACED NODE: ', textnode);
            addNodeMetaData(tempParent, foundTargettedWord, jsonData);
        }
    });
}

function addNodeMetaData(element, targetWord, jsonData) {
    // console.log('INSIDE ADD METADATA yo1');

    const slur = element.querySelector('.slur');
    if (!slur) return;

    slur.style.backgroundColor = '#ffde2155';
    slur.style.boxShadow = '0px 0px 5px #ffde21';
    slur.style.cursor = 'pointer';
    slur.style.zIndex = '3';
    slur.style.position = 'relative';

    let tooltipContainer = document.getElementById('slur-tooltip-container');
    if (!tooltipContainer) {
        tooltipContainer = document.createElement('div');
        tooltipContainer.id = 'slur-tooltip-container';
        tooltipContainer.style.position = 'absolute';
        tooltipContainer.style.zIndex = '999';
        document.body.appendChild(tooltipContainer);
        tooltipContainer.root = createRoot(tooltipContainer);
    }

    // Find the slur details from jsonData
    const matchedSlur = jsonData.find(
        (slur) =>
            Object.keys(slur)[0].toLowerCase() === targetWord.toLowerCase()
    );
    const slurDetails = matchedSlur
        ? matchedSlur[Object.keys(matchedSlur)[0]]
        : {};

    const handleMouseOver = () => {
        const rect = slur.getBoundingClientRect();
        tooltipContainer.style.top = `${rect.bottom + window.scrollY}px`;
        tooltipContainer.style.left = `${rect.left + window.scrollX}px`;

        // console.log('Position: ', {
        //     y: `${rect.bottom + window.scrollY}px`,
        //     x: `${rect.left + window.scrollX}px`
        // });

        tooltipContainer.root.render(
            <HoverSlurMetadata slurDetails={slurDetails} />
        );
    };

    const handleMouseOut = () => {
        tooltipContainer.root.render(null);
    };

    slur.addEventListener('mouseover', handleMouseOver);
    slur.addEventListener('mouseout', handleMouseOut);

    element.classList.add('slur-metadata-added');
}

export default {
    processNewlyAddedNodesGeneral,
    processNewlyAddedNodesGeneral2
};
