const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { config } = require('dotenv').config();
const { Game } = require('../models/games')

//TODO: GET by ID, DELETE, PUT

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

//TODO: Finish key verification and add it to dangerous verbs
//req.params.KEY maybe
function KeyVerification(reqKey){
  const key = process.env.API_KEY;

  if(reqKey != key){
    res.status(403)
  }

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
});

module.exports = router;
