import express from 'express';
import logger from 'morgan';
import path from 'path';
import process from 'process'
import dotenv from 'dotenv';
dotenv.config();

import {Redis} from '@upstash/redis';
global.redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
});

import router from './routers/main.js';

const app = express();

app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(process.cwd(), 'static')));

app.use(express.json());

app.use(router);

app.listen(80, 'localhost');