import express from 'express';
import logger from 'morgan';
import path from 'path';
import {LocalStorage} from 'node-localstorage';
import fsp from 'fs/promises';
import process from 'process'

const localStorage = new LocalStorage('/tmp/storage');

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

app.post('/submit', (req, res) => {
    if (req.body === null || typeof req.body !== 'object' || Array.isArray(req.body) || !Object.keys(req.body).length) {
        res.status(400).send('not ok');
        return;
    }

    console.log('inserting');

    let responses = JSON.parse(localStorage.getItem('responses')) ?? [];
    responses.push({...req.body, _resp_id: responses.length + 1});
    console.log('responses', responses);
    localStorage.setItem('responses', JSON.stringify(responses));

    res.status(200).send('ok');
});

app.get('/responses', (req, res) => {
    const responses = JSON.parse(localStorage.getItem('responses')) ?? [];
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

//app.listen(81, 'localhost');
//export default app;
app.listen(80);