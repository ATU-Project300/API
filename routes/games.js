const express = require('express');
const Joi = require('joi');
const router = express.Router();

const { Game } = require('../models/games')


function ValidateGame(game) {
    const gameJoiSchema = Joi.object(
        {
            title: Joi.required(),
            year: Joi.Number.integer.min(1950),
            description: Joi.String().min(10),
            image: Joi.String().min(8),
            consoles: Joi.String().min(2),
            emulator: Joi.String()
        }
    )
}

//TODO: Test POST
router.post('/', async (req, res) => {
    let result = ValidateGame(req.body)

    if (result.error) {
        res.status(400).json(result.error);
        return;
    }

    let game = new Game(req.body);
    try {
        game = await game.save();
        res
            .location(`${game._id}`)
            .status(201)
            .json(game)
    }
    catch (error) {
        res.status(500).send('db_error ' + error)
    }

});

//TODO: Add filters
router.get('/', async (req, res) => {
    const { title } = req.query;
    let filter = {};

    title ? filter.title = title : null;

    try {
        const games = await Game.find(title);
        res.json(games);
    }
    catch{
        res.status(404).json('Not found');
    }
})