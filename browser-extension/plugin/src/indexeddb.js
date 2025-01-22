import Dexie from 'dexie';
import repository from './repository';
const { getPreferenceData } = repository;

const db = new Dexie('SlurWordsDatabase');

// Define database schema
db.version(1).stores({
    words: '++id, word, source'
});

// Function to add a word to the database
export async function add_to_indexerdb(word) {
    try {
        const id = await db.words.add({
            word: word,
            timestamp: new Date().toISOString()
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

// Test function to add temp words to the DB (this could be done via UI too)
export async function addDataToDatabase() {
    console.log('inside db init');

    // Get personal slurList from preferences
    const preferences = await getPreferenceData();
    const personalSlurList = preferences?.slurList?.split(',') || [];
    let mainSlurList = 'जिहादी|छक्का|छिनाल|रंडी';
    const mainSlurListArray = mainSlurList.split('|');
    const wordCount = await db.words.count();
    console.log('Word count', wordCount);

    // Creating a mock array for slur crowdsource
    // Generate an array of 2,000 random words
    const randomWordsArray = Array.from({ length: 2000 }, () => {
        const wordLength = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
        const randomWord = Array.from({ length: wordLength }, () => {
            const charCode = Math.floor(Math.random() * 26) + 97;
            return String.fromCharCode(charCode);
        }).join('');
        return randomWord;
    });
    // console.log("RANDOM WORDS", randomWordsArray);

    if (wordCount === 0) {
        const defaultWords = [...personalSlurList, ...mainSlurListArray, ...randomWordsArray];
        // Prepare objects for bulkAdd
        const wordObjects = [
            ...personalSlurList.map(word => ({
                word: word,
                timestamp: new Date().toISOString(),
                source: 'personal'
            })),
            ...mainSlurListArray.map(word => ({
                word: word,
                timestamp: new Date().toISOString(),
                source: 'hard_coded'
            })),
            ...randomWordsArray.map(word => ({
                word: word,
                timestamp: new Date().toISOString(),
                source: 'crowdsourced'
            }))
        ];

        console.time('Bulk insertion time');
        try {
            await db.words.bulkAdd(wordObjects);
            console.log('Database initialized with default words');
            console.log('Words added to the database:', wordObjects.length);
        } catch (error) {
            console.error('Error during bulk add:', error);
        }
        console.timeEnd('Bulk insertion time');
    }
}
