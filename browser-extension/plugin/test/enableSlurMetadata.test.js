const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { findPositions, locateSlur, addMetaData, checkFalseTextNode, getAllTextNodes } = require('./slurDetection.js');
const { JSDOM } = require('jsdom');

jest.mock('./slurDetection.js', () => {
    const actualModule = jest.requireActual('./slurDetection.js');
    return {
        ...actualModule,
        checkFalseTextNode: jest.fn()
    };
});

describe('getAllTextNodes', () => {
    let dom;
    
    beforeEach(() => {
        dom = new JSDOM(`
            <html>
                <body>
                    <div id="root">
                        <p>Valid text node 1</p>
                        <span>Valid text node 2</span>
                        <div>
                            <span>Valid text node 3</span>
                        </div>
                    </div>
                </body>
            </html>
        `);
        
        checkFalseTextNode.mockImplementation((text, length) => {
            return text.trim().length === 0;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should collect all valid text nodes', () => {
        const root = dom.window.document.querySelector('#root');
        const uliStore = [];
        
        getAllTextNodes(root, uliStore);

        expect(uliStore.length).toBe(3); 

        expect(uliStore[0].node.textContent.trim()).toBe('Valid text node 1');
        expect(uliStore[1].node.textContent.trim()).toBe('Valid text node 2');
    });

    it('should ignore text nodes that only contain whitespace', () => {
        const root = dom.window.document.querySelector('#root');
        const uliStore = [];
        
        getAllTextNodes(root, uliStore);

        uliStore.forEach(item => {
            expect(item.node.textContent.trim()).not.toBe('');
        });
    });

    it('should correctly associate the parent node with the text node', () => {
        const root = dom.window.document.querySelector('#root');
        const uliStore = [];
        
        getAllTextNodes(root, uliStore);

        expect(uliStore[0].parent.tagName).toBe('P');
        expect(uliStore[1].parent.tagName).toBe('SPAN');
    });
});

describe('locateSlur', () => {
    function setupMockDOM(uliStore) {
        uliStore.forEach(store => {
            const parentElement = document.createElement('div');
            const textNode = document.createTextNode(store.text);

            parentElement.appendChild(textNode);
            store.parent = parentElement;
            store.node = textNode;

            document.body.appendChild(parentElement);
        });
    }

    beforeEach(() => {
        document.body.innerHTML = '';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('replaces target words with annotated spans and updates the DOM correctly', () => {
        const targetWords = ['crazy', 'mad'];

        const uliStore = [
            { text: 'This is a crazy situation.', parent: null, node: null },
            { text: 'Don\'t be mad at me!', parent: null, node: null },
            { text: 'This is a normal sentence.', parent: null, node: null }
        ];

        setupMockDOM(uliStore);

        const result = locateSlur(uliStore, targetWords);

        const firstParentElement = result[0].parent;
        expect(firstParentElement.innerHTML).toContain('crazy<span class="icon-container-crazy"></span>');

        const secondParentElement = result[1].parent;
        expect(secondParentElement.innerHTML).toContain('mad<span class="icon-container-mad"></span>');

        const thirdParentElement = result[2].parent;
        expect(thirdParentElement.innerHTML).toBe('This is a normal sentence.');

        expect(firstParentElement.querySelector('span')).not.toBeNull();
        expect(secondParentElement.querySelector('span')).not.toBeNull();

        expect(firstParentElement.textContent).toContain('crazy');
        expect(secondParentElement.textContent).toContain('mad');
    });

    it('returns the updated uliStore with the correct slur positions', () => {
        const targetWords = ['stupid'];

        const uliStore = [
            { text: 'This is a stupid mistake.', parent: null, node: null }
        ];

        setupMockDOM(uliStore);

        const result = locateSlur(uliStore, targetWords);

        const slurs = result[0].slurs;
        expect(slurs).toHaveLength(1); 
        expect(slurs[0]).toHaveProperty('slurText'); 

        const parentElement = result[0].parent;
        expect(parentElement.innerHTML).toContain('stupid<span class="icon-container-stupid"></span>');
    });
});

describe('findPositions', () => {
    test('finds positions of a single occurrence of a word', () => {
        const result = findPositions('word', 'This is a word in a sentence.');
        expect(result).toEqual({
            slurText: 'word',
            slurLocation: [[10, 14]]
        });
    });

    test('finds positions of multiple occurrences of a word', () => {
        const result = findPositions('test', 'This test is just a test.');
        expect(result).toEqual({
            slurText: 'test',
            slurLocation: [[5, 9], [20, 24]]
        });
    });

    test('returns an empty object if the word is not found', () => {
        const result = findPositions('missing', 'This sentence has no such word.');
        expect(result).toEqual({});
    });
});

describe('checkFalseTextNode', () => {
    test('returns true for text nodes with only spaces', () => {
        expect(checkFalseTextNode("    ", 4)).toBe(true);
    });

    test('returns true for text nodes with newline characters', () => {
        expect(checkFalseTextNode("\n\n", 2)).toBe(true);
    });

    test('returns false for text nodes with non-whitespace characters', () => {
        expect(checkFalseTextNode("text\n ", 5)).toBe(false);
    });

    test('returns true for text nodes with mixed spaces and tabs', () => {
        expect(checkFalseTextNode(" \t \t", 4)).toBe(true);
    });
});

describe('addMetaData', () => {
    beforeEach(() => {
        document.body.innerHTML = `
          <div class="icon-container-crazy">crazy</div>
          <div class="icon-container-mad">mad</div>
          <div class="icon-container-stupid">stupid</div>
        `;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('adds metadata with tooltip for target words', () => {
        const targetWords = ['crazy', 'mad', 'stupid'];
        
        addMetaData(targetWords);

        targetWords.forEach(targetWord => {
            const element = document.querySelector(`.icon-container-${targetWord}`);
            expect(element).not.toBeNull();

            const sup = element.querySelector('sup');
            expect(sup).not.toBeNull();

            const img = sup.querySelector('img');
            expect(img).not.toBeNull();
            expect(img.src).toContain('Minimalist_info_Icon.png');

            const span = sup.querySelector('span');
            expect(span).not.toBeNull();
            expect(span.style.display).toBe('none'); 

            if (targetWord === 'crazy') {
                expect(span.textContent).toContain('perpetuate stereotypes about mental health');
            } else if (targetWord === 'mad') {
                expect(span.textContent).toContain('Using "mad" to describe someone negatively can be insensitive');
            } else if (targetWord === 'stupid') {
                expect(span.textContent).toContain('Describing actions or decisions as "stupid" can be demeaning');
            }
        });
    });

    it('displays and hides tooltip on mouseover and mouseout', () => {
        const targetWords = ['crazy'];
        
        addMetaData(targetWords);

        const element = document.querySelector('.icon-container-crazy');
        const img = element.querySelector('img');
        const span = element.querySelector('span');

        const mouseOverEvent = new Event('mouseover');
        img.dispatchEvent(mouseOverEvent);
        expect(span.style.display).toBe('inline-block');

        const mouseOutEvent = new Event('mouseout');
        img.dispatchEvent(mouseOutEvent);
        expect(span.style.display).toBe('none'); 
    });
});
