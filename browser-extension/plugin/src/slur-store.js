import Dexie from 'dexie';
import mainSlurList from './slurlist-main';

const db = new Dexie('SlurWordsDatabase');

// Define database schema
db.version(1).stores({
    words: '++id, word, source'
});

// Function to add a word to the database
export async function addSlur(word, source) {
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

// Function to get all words
export async function getAllSlurs() {
    try {
        const words = await db.words.toArray();
        return words;
    } catch (error) {
        console.error(`Error getting all words from database: ${error}`);
        throw error;
    }
}

// Function to get all words by source
export async function getSlursBySource(source) {
    try {
        if (!source || typeof source !== 'string') {
            throw new Error('Source must be a valid string');
        }
        const words = await db.words.where('source').equals(source).toArray();
        return words;
    } catch (error) {
        console.error(`Error getting words by source "${source}":`, error);
        throw error;
    }
}

// Function to bulk add words to the database
export async function bulkAddSlurs(wordsArray, source) {
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

// Function to delete a single slur
export async function deleteSlur(word, source) {
    try {
        const slurToDelete = await db.words
            .where('source')
            .equals(source)
            .and((slur) => slur.word === word)
            .first(); // Fetch only the first matching slur

        if (slurToDelete) {
            await db.words.delete(slurToDelete.id);
            console.log(`Deleted slur "${word}" from source "${source}".`);
        } else {
            console.log(`Slur "${word}" not found for source "${source}".`);
        }
    } catch (error) {
        console.error(`Error deleting slur "${word}" from source "${source}":`, error);
    }
}

// Function to check if a slur exists in the database
export async function slurExists(word, source) {
    try {
        const count = await db.words
            .where('source')
            .equals(source)
            .filter((slur) => slur.word === word)
            .count();
        return count > 0; // Returns true if the slur exists, else false
    } catch (error) {
        console.error(`Error checking if slur exists: ${error}`);
        throw error;
    }
}

export async function initializeSlurs() {
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
            await bulkAddSlurs(mainSlurListArray, 'hard_coded');
            console.log(`Indexed ${mainSlurListArray.length} hard-coded slurs into the database.`);
        } else {
            console.log('No slurs found in the JSON file.');
        }
    } catch (error) {
        console.error('Error during database initialization:', error);
    }
}
