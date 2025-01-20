import Dexie from 'dexie';

const db = new Dexie('SlurWordsDatabase');

// Define database schema
db.version(1).stores({
    words: '++id, word' // Primary key is id, word is indexed
});

// Function to add a word to the database
export async function add_to_indexerdb(word) {
    try {
        const id = await db.words.add({
            word: word,
            timestamp: new Date().toISOString()
        });
        console.log(`Word added successfully with id: ${id}`);
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
        console.error(`Error getting word from database: ${error}`);
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

// Test function to add temp words to the DB (this could be done via UI too)
// Initialize database with default words
export async function initializeDatabase() {
    const wordCount = await db.words.count();
    if (wordCount === 0) {
        const defaultWords = ['tattle', 'uli'];
        for (const word of defaultWords) {
            await add_to_indexerdb(word);
        }
        console.log('Database initialized with default words');
    }
}
