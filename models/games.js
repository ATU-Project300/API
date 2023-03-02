const mongoose = require('mongoose');
const Joi = require('joi');

const gameSchema = new mongoose.Schema({
    title: {type: String, required: true},
    year: Number,
    description: String,
    image: String,
    consoles: String,
    emulator: String,
    rating: {type: Number, default: 0} // Add rating field
});

function ValidateGame(game){
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

const Game = mongoose.model('Game', gameSchema);

module.exports = {Game, ValidateGame};
