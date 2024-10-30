import express from 'express';
import fsp from 'fs/promises';
import path from 'path';

const router = express.Router();
export default router;

// Read all word sets from file
const allWords = JSON.parse(await fsp.readFile(path.join(process.cwd(), 'words.json')));

// Standard Fisher-Yates shuffle
function shuffle(array) {
    array = [...array];
    let i = array.length;
    while (i) {
        let j = Math.floor(Math.random() * i--);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

router.post('/submit', async (req, res) => {
    // Don't add empty responses to db
    if (req.body === null || typeof req.body !== 'object' || Array.isArray(req.body) || !Object.keys(req.body).length) {
        res.status(400).send('not ok');
        return;
    }

    // Push new response to redis
    await redis.lpush('responses', {...req.body, _resp_id: await redis.llen('responses') + 1});

    res.status(200).send('ok');
});

router.get('/responses', async (req, res) => {
    // Get responses as array from redis
    const responses = await redis.lrange('responses', 0, -1);

    // Find all unique columns across all existing responses
    const columns = [...new Set(responses.flatMap(response => Object.keys(response)))].sort();

    // Build rows from column names (allowing columns to be empty)
    const rows = responses.map(response => columns.map(col => response[col]));

    // Render responses as table
    res.render('responses', {columns, rows});
});

router.get('/', (req, res) => {
    
    // If a question limit is specified, we only take the first X sets of words
    const limit = req.query.questionLimit ?? allWords.length;
    const wordSet = allWords.slice(0, limit);

    // Make 1 question per font per word list
    let questions = ['comic', 'arial'].flatMap(font =>
        wordSet.map((words, index) => ({
            id: `q${String(index + 1).padStart(2, '0')}_${font}`, // Unique ID based on word list index + font name
            words: shuffle(words), // Shuffle word list randomly every time
            targetWord: words[Math.floor(Math.random() * words.length)], // Always pick random target word
            font,
        }))
    );

    // Shuffle actual question order
    questions = shuffle(questions);

    res.render('survey', {questions});
});