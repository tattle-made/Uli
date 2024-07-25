function checkFalseTextNode(text, actualLengthOfText) {
    let totalNewlineAndWhitespaces = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === "\n" || text[i] === " " || text[i] === "\t") {  // I think not only \n and " " , if a textNode is comprised of any escape characters and whitespace, it should be a false textNode
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
        let text = store.node.textContent
        //We have to look into this store for all the slurWords 
        let slurs = [];

        targetWords.forEach(targetWord => {
            let slurWord = targetWord;
            let pos = findPositions(slurWord, text);
            if (Object.keys(pos).length !== 0) {
                slurs.push(pos)
            }

            if (parentNode.innerHTML.includes(targetWord)) {
                const className = `icon-container-${targetWord}`;
                const parts = parentNode.innerHTML.split(targetWord);
                const replacedHTML = parts.join(`${targetWord}<span class="${className}"></span>`);
                parentNode.innerHTML = replacedHTML
            }
        })
        uliStore[i].slurs = slurs;
    }
    return uliStore; //This will return the final uliStore (after appending slurs)
}


function addMetaData(targetWords) {
    targetWords.forEach(targetWord => {
        const className = `icon-container-${targetWord}`
        const elements = Array.from(document.querySelectorAll(`.${className}`))
        elements.forEach(element => {

            let sup = document.createElement("sup");

            let img = document.createElement("img");
            img.style.height = "2%"
            img.style.width = "2%"
            img.style.cursor = "pointer"
            // img.src = "https://upload.wikimedia.org/wikipedia/commons/4/43/Minimalist_info_Icon.png"
            img.src = "./info.png"
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


let targetWords = ["stupid", "crazy", "Crazy", "mad"]
let uliStore = []
getAllTextNodes(document.body, uliStore)
abc = locateSlur(uliStore, targetWords)
console.log("uliStore", abc)
addMetaData(targetWords)
