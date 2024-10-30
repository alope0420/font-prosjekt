import express from 'express';
import fsp from 'fs/promises';
import path from 'path';

const router = express.Router();
export default router;

// Read all word sets from file
const allWords = JSON.parse(await fsp.readFile(path.join(process.cwd(), 'words.json')))
    .map(words => [...new Set(words)]);

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
    await redis.lpush('responses', req.body);

    res.status(200).send('ok');
});

router.get('/responses', async (req, res) => {
    // Get responses as array from redis
    const responses = (await redis.lrange('responses', 0, -1)).reverse();

    // Find all unique columns across all existing responses
    let columns = [...new Set(responses.flatMap(response => Object.keys(response)))].sort();

    // Build rows from column names (allowing columns to be empty)
    const rows = responses.map((response, index) => [index + 1, ...columns.map(col => response[col])]);
    columns.unshift('response_id');

    // Render responses as table
    res.render('responses', {columns, rows});
});

router.get('/', async (req, res) => {
    
    // If a question limit is specified, we only take the first X sets of words
    const limit = req.query.questionLimit ?? 16;
    const wordSet = shuffle(allWords).slice(0, limit);
    const WORDS_PER_SET = req.query.questionOptions ?? 20;

    // Make 1 question per font per word list
    let questions = ['comic', 'arial'].flatMap(font =>
        wordSet.map((words, index) => {
            let question = {
                id: `q${String(index + 1).padStart(2, '0')}_${font}`, // Unique ID based on word list index + font name
                words: shuffle(words).slice(0, WORDS_PER_SET), // Shuffle word list randomly every time
                font,
            };
            // Always pick random target word, but not the first one
            question.targetWord = question.words[1 + Math.floor(Math.random() * (question.words.length - 1))];
            return question;
        })
    );

    // Shuffle actual question order
    questions = shuffle(questions);

    const fastestTime = Math.min(...(await redis.lrange('responses', 0, -1)).map(response => response.totalTime).filter(x=>x)) || 0;

    res.render('survey', {questions, fastestTime});
});