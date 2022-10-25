const express = require('express');
const mongoose = require('mongoose');

const app = express();
//TODO: Set up process.env.PORT etc.
const port = 3000;

app.use(express.json());

app.get('/', (res) => res.send('API Online'));

app.listen(port, () => console.log('API running on port ${port}'));
