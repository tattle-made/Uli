import mainSlurList from './slurlist-main';
import { getPublicSlursMetadata } from './api/public-slurs';

// Function to add a word to the database
export async function addSlur(db, word, source) {
    try {
        const id = await db.words.add({
            word: word,
            timestamp: new Date().toISOString(),
            source: source,
            enable_status: true
        });
        return id;
    } catch (error) {
        console.error(`Error adding word to database: ${error}`);
        throw error;
    }
}

// Function to get all words
export async function getAllSlurs(db) {
    try {
        const words = await db.words.toArray();
        return words;
    } catch (error) {
        console.error(`Error getting all words from database: ${error}`);
        throw error;
    }
}

// Function to get all words by source
export async function getSlursBySource(db, source) {
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
export async function bulkAddSlurs(db, wordsArray, source) {
    if (!Array.isArray(wordsArray) || typeof source !== 'string') {
        throw new Error('Invalid input: wordsArray must be an array and source must be a string');
    }

    // Prepare word objects with source and timestamp
    const wordObjects = wordsArray.map((word) => ({
        word: word,
        timestamp: new Date().toISOString(),
        source: source,
        enable_status: true
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
export async function deleteSlur(db, word, source) {
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
export async function slurExists(db, word, source) {
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

// Function to bulk add slur metadata to the database
export async function bulkAddSlurMetadata(db, metadataArray) {
    if (!Array.isArray(metadataArray)) {
        throw new Error('Invalid input: metadataArray must be an array');
    }

    // Prepare metadata objects for the database
    const timestamp = new Date().toISOString();
    const metadataObjects = metadataArray.map((metadata) => ({
        label: metadata.label,
        level_of_severity: metadata.level_of_severity,
        casual: metadata.casual,
        appropriated: metadata.appropriated,
        appropriation_context: metadata.appropriation_context,
        meaning: metadata.meaning,
        language: metadata.language,
        batch: metadata.batch,
        categories: metadata.categories,
        timestamp: timestamp,
    }));

    try {
        await db.words_metadata.bulkAdd(metadataObjects);
        console.log(`${metadataObjects.length} slur metadata added.`);
    } catch (error) {
        console.error('Error adding slur metadata:', error);
        throw error;
    }
}

// Function to fetch all slur metadata from the database
export async function getAllSlurMetadata(db) {
    try {
        const slurMetadata = await db.words_metadata.toArray();
        return slurMetadata;
    } catch (error) {
        console.error('Error fetching slur metadata:', error);
        throw error;
    }
}

export async function convertSlurMetadataFromDBtoJSON(db) {
    try {
        const slurMetadata = await getAllSlurMetadata(db);

        // Format the data into the desired structure
        let jsonData = [];
        jsonData = slurMetadata.map(slur => {
            return {
                [slur.label]: {
                    "Level of Severity": slur.level_of_severity,
                    "Casual": slur.casual ? "Yes" : "No",
                    "Appropriated": slur.appropriated ? "Yes" : "No",
                    "If, Appropriated, Is it by Community or Others?": slur.appropriation_context || "",
                    "What Makes it Problematic?": slur.meaning || "",
                    "Categories": slur.categories
                }
            };
        });

        // console.log("Formatted jsonData:", jsonData);
        return jsonData;
    } catch (error) {
        console.error('Error fetching or formatting slur metadata:', error);
    }
}

export async function deleteSlurMetadataEntries(db, entriesToDelete) {
    if (!Array.isArray(entriesToDelete) || entriesToDelete.length === 0) {
        console.warn("No valid entries provided for deletion.");
        return;
    }

    try {
        for (const entry of entriesToDelete) {
            await db.words_metadata
                .filter(dbEntry => 
                    dbEntry.label === entry.label &&
                    dbEntry.level_of_severity === entry.level_of_severity &&
                    dbEntry.meaning === entry.meaning &&
                    JSON.stringify(dbEntry.categories) === JSON.stringify(entry.categories) &&
                    dbEntry.language === entry.language &&
                    dbEntry.timestamp === entry.timestamp
                )
                .delete();
        }
        console.log(`${entriesToDelete.length} metadata entries deleted.`);
    } catch (error) {
        console.error('Error deleting slur metadata:', error);
    }
}

export async function fetchPublicSlursMetadata(db) {
    try {
        // Fetch slurs from the backend
        const publicSlursMetadata = await getPublicSlursMetadata();
        // Fetch existing metadata from the indexed database
        const existingMetadata = await getAllSlurMetadata(db);
        // Convert existing metadata to a Set of JSON strings for exact comparison
        const publicMetadataSet = new Set(publicSlursMetadata.map(meta => JSON.stringify(meta)));
        const existingMetadataSet = new Set(existingMetadata.map(meta => JSON.stringify(meta)));
        // Identify metadata that needs to be added (exists in fetched data but not in DB)
        const newMetadata = publicSlursMetadata.filter(meta => 
            !existingMetadataSet.has(JSON.stringify(meta))
        );
        // Identify metadata that needs to be removed (exists in DB but not in fetched data)
        const outdatedMetadata = existingMetadata.filter(meta => 
            !publicMetadataSet.has(JSON.stringify(meta))
        );
        // Add new metadata
        if (newMetadata.length > 0) {
            await bulkAddSlurMetadata(db, newMetadata);
            console.log(`${newMetadata.length} new slur metadata entries added.`);
        }
        // Delete outdated metadata
        if (outdatedMetadata.length > 0) {
            await deleteSlurMetadataEntries(db, outdatedMetadata);
            console.log(`${outdatedMetadata.length} outdated slur metadata entries removed.`);
        }
    } catch (error) {
        console.error('Error fetching and updating public slurs metadata:', error);
    }
}

export async function initializeSlurs(db) {
    console.log('Initializing Indexed database');

    try {
        // Check if any words with source "hard_coded" already exist
        const mainSlurListArray = mainSlurList.split('|');
        const existingWords = await db.words
            .where('source')
            .equals('hard_coded')
            .toArray();
        const existingWordSet = new Set(existingWords.map(wordObj => wordObj.word))
        // Check if all words in mainSlurListArray exist in the database
        const allWordsExist = mainSlurListArray.every(word => existingWordSet.has(word));
        if (allWordsExist) {
            console.log('All hard-coded slurs already exist in the database. Skipping initialization.');
            return;
        }

        // Index hard-coded slurs into the database
        if (mainSlurListArray.length > 0) {
            await bulkAddSlurs(db, mainSlurListArray, 'hard_coded');
            console.log(`Indexed ${mainSlurListArray.length} hard-coded slurs into the database.`);
        } else {
            console.log('No slurs found in the JSON file.');
        }

        // fetch public metadata
        await fetchPublicSlursMetadata(db);
    } catch (error) {
        console.error('Error during database initialization:', error);
    }
}