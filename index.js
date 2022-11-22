const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit')
const games = require('./routes/games');

import rateLimit from 'express-rate-limit'

// TODO: .env file

const app = express();

//TODO: process.env.PORT etc.
const port = 3000;

//TODO: API key in .env - max chars possible
const key = "";

// TODO: Tune rate limiting
// Currently using Discord's rate limit.
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 10000, // Limit each IP to 10,000 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

app.use(express.json());

app.use('/games', games)

app.get('/', (res) => res.send('API Online'));


app.listen(port, () => console.log('API running on port ${port}'));
