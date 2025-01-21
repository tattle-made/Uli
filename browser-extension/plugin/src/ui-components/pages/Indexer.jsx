import React, { useState, useEffect } from 'react';
import { Box, Heading, List, Text } from 'grommet';
import { get_all_words, addDataToDatabase } from '../../indexeddb';
import repository from '../../repository';
const { setPreferenceData, getPreferenceData } = repository;

const Indexer = () => {
    const [words, setWords] = useState([]);

    useEffect(() => {
        const loadWords = async () => {
            try {
                // Initialize database
                await addDataToDatabase();
                // Fetch all words
                const allWords = await get_all_words();
                setWords(allWords);

                // Log preference data
                const preferenceInLS = await getPreferenceData();
                console.log('Preference data:', preferenceInLS);
            } catch (err) {
                console.error('Error loading words:', err);
            }
        };

        loadWords();
    }, []);

    return (
        <Box pad="medium">
            <Heading level={3}>Stored Words</Heading>
            <List
                data={words}
                margin={{ top: 'small' }}
                pad={{ left: 'small' }}
                primaryKey={(item) => (
                    <Text key={item.id}>{item.word || 'No word found'}</Text>
                )}
            />
        </Box>
    );
};

export default Indexer;
