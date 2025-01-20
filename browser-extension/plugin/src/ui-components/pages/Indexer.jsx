import React, { useState, useEffect } from 'react';
import { Box, Heading, List, Text } from 'grommet';
import { get_all_words } from '../../indexeddb';

const Indexer = () => {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadWords = async () => {
            try {
                setLoading(true);
                const allWords = await get_all_words();
                setWords(allWords);
                setError(null);
            } catch (err) {
                setError('Failed to load words');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadWords();
    }, []);

    if (loading) return (
        <Box pad="medium">
            <Text>Loading...</Text>
        </Box>
    );

    if (error) return (
        <Box pad="medium">
            <Text color="status-error">Error: {error}</Text>
        </Box>
    );

    return (
        <Box pad="medium">
            <Heading level={2}>Stored Words</Heading>
            <List 
                data={words}
                margin={{ top: 'small' }}
                pad={{ left: 'small' }}
                primaryKey={(item) => (
                    <Text key={item.id}>{item.word}</Text>
                )}
            />
        </Box>
    );
};

export default Indexer;