const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { config } = require('dotenv').config();
const { Game } = require('../models/games')

//TODO: PUT

function ValidateGame(game) {
    const gameJoiSchema = Joi.object(
        {
            title: Joi.required(),
            year: Joi.number().min(1950),
            description: Joi.string().min(10),
            image: Joi.string().min(8),
            consoles: Joi.string().min(2),
            emulator: Joi.string()
        }
    )
  return gameJoiSchema.validate(game);
}

//TODO: Add filters
router.get('/', async (req, res) => {
    const { title, year, consoles, emulator } = req.query;
    let filter = {};

    title ? filter.title = title : null;
    year ? filter.year = year : null;
    consoles ? filter.consoles = consoles : null;
    emulator ? filter.emulator = emulator : null;

    try {
        const games = await Game.find(filter);
        res.json(games);
    }
    catch{
        res.status(404).json('Not found');
    }
});

router.get('/:id', async (req, res) => {

    try {
        const game = await Game.findById(req.params.id);
        if (game) {
            res.json(game);
        }
        else {
            res.status(404).json('Not found');
        }
    }
    catch (error) {
        res.status(404).json('ID does not exist.' + error);
    }
})

/*  PROTECT ALL ROUTES THAT FOLLOW (All requests made to the below methods are protected by this one)
    Setting up key auth in Postman:
        Use Authorization -> Type "API Key"
        Key: API_KEY
        Value: yourapikey
        Add to: Header
*/

if (!process.env.SKIP_AUTH || process.env.SKIP_AUTH == "false") {
    router.use((req, res, next) => {
        const apiKey = req.get('API_KEY')
        if (!apiKey || apiKey !== process.env.API_KEY) {
            res.status(401).json({ error: 'Unauthorised' })
        } else {
            next()
        }
    })
}

//TODO: Test POST with invalid data
//TODO: Test POST with/without API key
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

router.delete('/:id', async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);
        if (game)
            res.status(204).send();
        else
            res.status(404).json(`Game with ID ${req.params.id} not found`)
    }
    catch {
        res.status(404).json(`Error caused by ID: ${req.params.id}`);
    }
})

module.exports = router;
