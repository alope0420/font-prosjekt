import express from 'express';
import logger from 'morgan';
import path from 'path';
import fsp from 'fs/promises';
import process from 'process'
import dotenv from 'dotenv';
dotenv.config();

import { Redis } from '@upstash/redis'

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
});

const app = express();

app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(process.cwd(), 'static')));

app.use(express.json());

const allWords = JSON.parse(await fsp.readFile(path.join(process.cwd(), 'words.json')));

function shuffle(array) {
    let i = array.length;
    while (i) {
        let j = Math.floor(Math.random() * i--);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

app.post('/submit', async (req, res) => {
    if (req.body === null || typeof req.body !== 'object' || Array.isArray(req.body) || !Object.keys(req.body).length) {
        res.status(400).send('not ok');
        return;
    }

    await redis.lpush('responses', {...req.body, _resp_id: await redis.llen('responses') + 1});

    res.status(200).send('ok');
});

app.get('/responses', async (req, res) => {
    const responses = await redis.lrange('responses', 0, -1);
    const columns = [...new Set(responses.flatMap(response => Object.keys(response)))].sort();
    const rows = responses.map(response => columns.map(col => response[col]));
    res.render('responses', {columns, rows});
});

app.get('/', (req, res) => {
    
    const limit = req.query.questionLimit ?? allWords.length;
    const wordSet = allWords.slice(0, limit);

    let questions = ['comic', 'arial'].flatMap(font =>
        wordSet.map((words, index) => ({
            id: `${index + 1}_${font}`,
            words: shuffle(words),
            targetWord: words[Math.floor(Math.random() * words.length)],
            font,
        }))
    );

    shuffle(questions);

    res.render('survey', {questions});
});

app.listen(81, 'localhost');