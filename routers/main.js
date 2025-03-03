import express from 'express';
import fsp from 'fs/promises';
import path from 'path';

const router = express.Router();
export default router;

const WORDLIST_FILE = 'words.json';
const FONTS = ['arial', 'comic']; // Only used for applying correct CSS styles in frontend
const QUESTIONS_PER_FONT = 16;
const OPTIONS_PER_QUESTION = 20;

// Read all word sets from file
const wordlist = await fsp.readFile(path.join(process.cwd(), WORDLIST_FILE));
const allWords = JSON.parse(wordlist).map(words => [...new Set(words)]); // Discard duplicate words

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

async function renderTabularData(responseObject, redisLrangeName, columns) {
    // Get responses as array from redis
    const responses = (await redis.lrange(redisLrangeName, 0, -1)).reverse();

    // Build rows from column names
    const rows = responses.map(response => [...columns.map(col => response[col])]);

    // Render responses as table
    responseObject.render('tabular-data', {columns, rows});
}

router.get('/responses', async (req, res) => {
    await renderTabularData(res, 'responses',
        ['response_id', 'browser_id', 'question_number', 'font', 'time', 'errors']
    );
});

router.get('/totals', async (req, res) => {
    await renderTabularData(res, 'totals',
        ['response_id', 'browser_id', 'font', 'time', 'errors']
    );
});

router.post('/submit', async (req, res) => {
    // Don't add empty responses to db
    const data = req.body;
    if (!data?.responses || !data?.totals) {
        res.status(400).send({});
        return;
    }

    let {responses, totals, totalTime} = data;
    const responseId = parseInt(await redis.get('last_response_id') ?? 0) + 1; // Display IDs 1-based
    responses = responses.map(row => ({...row, response_id: responseId}));
    totals = totals.map(row => ({...row, response_id: responseId}));

    // Push new response to redis
    await redis.set('last_response_id', responseId);
    await redis.lpush('responses', ...responses);
    await redis.lpush('totals', ...totals);
    await redis.lpush('total_time', totalTime);
    console.log('redis done');

    res.status(200).send({responseId});
});

router.get('/', async (req, res) => {
    
    // If a question limit is specified, we only take the first X sets of words
    const limit = req.query.questionLimit ?? QUESTIONS_PER_FONT;
    const wordSet = shuffle(allWords).slice(0, limit);
    const WORDS_PER_SET = req.query.questionOptions ?? OPTIONS_PER_QUESTION;

    // Make 1 question per font per word list
    let questions = FONTS.flatMap((font, fontIndex) =>
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
    const totalTimes = await redis.lrange('total_time', 0, -1);
    res.render('survey', {questions, fastestTime: Math.min(...totalTimes)});
});