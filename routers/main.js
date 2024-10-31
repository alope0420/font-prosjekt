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
    if (req.body === null || !Array.isArray(req.body)) {
        res.status(400).send({});
        return;
    }

    const response_id = parseInt(await redis.get('last_response_id') ?? 0) + 1;
    const totalTime = req.body.pop();
    const rows = req.body.map(row => ({...row, response_id}));

    // Push new response to redis
    await redis.set('last_response_id', response_id);
    await redis.lpush('rows', ...rows);
    await redis.lpush('total_time', totalTime);
    console.log('redis done');

    res.status(200).send({responseId: response_id});
});

router.get('/responses', async (req, res) => {
    // Get responses as array from redis
    const responses = (await redis.lrange('rows', 0, -1)).reverse();
    let columns = ['response_id', 'browser_id', 'question_number', 'font', 'time', 'errors'];

    // Build rows from column names
    const rows = responses.map(response => [...columns.map(col => response[col])]);

    // Render responses as table
    res.render('responses', {columns, rows});
});

router.get('/', async (req, res) => {
    
    // If a question limit is specified, we only take the first X sets of words
    const limit = req.query.questionLimit ?? 16;
    const wordSet = shuffle(allWords).slice(0, limit);
    const WORDS_PER_SET = req.query.questionOptions ?? 20;

    // Make 1 question per font per word list
    let questions = ['arial', 'comic'].flatMap((font, fontIndex) =>
        wordSet.map((words, index) => {
            let question = {
                id: index + 1,
                font,
                fontIndex,
                words: shuffle(words).slice(0, WORDS_PER_SET), // Shuffle word list randomly every time
            };
            // Always pick random target word, but not the first one
            question.targetWord = question.words[1 + Math.floor(Math.random() * (question.words.length - 1))];
            return question;
        })
    );

    // Shuffle actual question order
    questions = shuffle(questions);

    //const fastestTime = Math.min(...(await redis.lrange('responses', 0, -1)).map(response => response.totalTime).filter(x=>x)) || 0;

    res.render('survey', {questions, fastestTime: Math.min(...(await redis.lrange('total_time', 0, -1)))});
});