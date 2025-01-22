import Dexie from 'dexie';
import mainSlurList from './slurlist-main';

const db = new Dexie('SlurWordsDatabase');

// Define database schema
db.version(1).stores({
    words: '++id, word, source'
});

// Function to add a word to the database
export async function add_to_indexerdb(word, source) {
    try {
        const id = await db.words.add({
            word: word,
            timestamp: new Date().toISOString(),
            source: source
        });
        return id;
    } catch (error) {
        console.error(`Error adding word to database: ${error}`);
        throw error;
    }
}

// Function to get a word by id
export async function get_word_by_id(id) {
    try {
        const word = await db.words.get(id);
        return word;
    } catch (error) {
        throw error;
    }
}

// Function to get all words
export async function get_all_words() {
    try {
        const words = await db.words.toArray();
        return words;
    } catch (error) {
        console.error(`Error getting all words from database: ${error}`);
        throw error;
    }
}

// Function to bulk add words to the database
export async function bulkAddWords(wordsArray, source) {
    if (!Array.isArray(wordsArray) || typeof source !== 'string') {
        throw new Error('Invalid input: wordsArray must be an array and source must be a string');
    }

    // Prepare word objects with source and timestamp
    const wordObjects = wordsArray.map((word) => ({
        word: word,
        timestamp: new Date().toISOString(),
        source: source
    }));

    try {
        await db.words.bulkAdd(wordObjects);
        console.log(`${wordObjects.length} words added from source: ${source}`);
    } catch (error) {
        console.error(`Error adding words from source "${source}":`, error);
        throw error;
    }
}


export async function initIndexedDB() {
    console.log('Initializing Indexed database');

    try {
        // Check if any words with source "hard_coded" already exist
        const hardCodedWordCount = await db.words
            .where('source')
            .equals('hard_coded')
            .count();

        if (hardCodedWordCount > 0) {
            console.log('Hard-coded slurs already exist in the database. Skipping initialization.');
            return;
        }

        const mainSlurListArray = mainSlurList.split('|');
        // Index hard-coded slurs into the database
        if (mainSlurListArray.length > 0) {
            await bulkAddWords(mainSlurListArray, 'hard_coded');
            console.log(`Indexed ${mainSlurListArray.length} hard-coded slurs into the database.`);
        } else {
            console.log('No slurs found in the JSON file.');
        }
    } catch (error) {
        console.error('Error during database initialization:', error);
    }
}
