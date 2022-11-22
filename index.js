const express = require('express');
const mongoose = require('mongoose');
const db = require('./database');
const { config } = require('dotenv');
const rateLimit = require('express-rate-limit')
const games = require('./routes/games');

//dotenv setup
config()

const app = express();

const port = process.env.PORT;

//TODO: API key in .env - max chars possible
const key = process.env.API_KEY;

// TODO: Tune rate limiting
// Currently using Discord's rate limit settings.
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 10000, // Limit each IP to 10,000 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

app.use(express.json());

app.use('/games', games)

app.get('/', (req, res) => res.send('API Online!'))


console.log("PORT: " + port)
console.log("API KEY: " + key)

app.listen(port, () => console.log('API running...'));
