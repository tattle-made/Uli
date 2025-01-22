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

// Function to get a word by id
export async function getSlurById(id) {
    try {
        const word = await db.words.get(id);
        return word;
    } catch (error) {
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

export async function bulkDeleteSlurs(wordsToDelete, source) {
    try {
        if (!wordsToDelete || wordsToDelete.length === 0) {
            console.log(`No words to delete for source "${source}".`);
            return;
        }
        // Fetch the primary keys of the words to delete based on the source
        const keysToDelete = await db.words
            .where('source')
            .equals(source)
            .filter((word) => wordsToDelete.includes(word.word))
            .primaryKeys();

        if (keysToDelete.length > 0) {
            await db.words.bulkDelete(keysToDelete);
        } else {
            console.log(`No words found to delete for source "${source}".`);
        }
    } catch (error) {
        console.error(`Error during bulk deletion for source "${source}":`, error);
    }
}

export async function getSlurDifferences(slurList, source) {
    try {
        const existingSlurs = await db.words
            .where('source')
            .equals(source)
            .toArray();

        const existingSlurWords = existingSlurs.map((slur) => slur.word);
        const slursToAdd = slurList.filter(
            (word) => !existingSlurWords.includes(word)
        );
        const slursToRemove = existingSlurWords.filter(
            (word) => !slurList.includes(word)
        );

        return { slursToAdd, slursToRemove };
    } catch (error) {
        console.error(`Error fetching slur differences for source "${source}":`, error);
        return { slursToAdd: [], slursToRemove: [] };
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
