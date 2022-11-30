const mongoose = require('mongoose');
const Joi = require('joi');

//TODO: Proper emulator model and validation
const emulatorSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    image: String,
    consoles: String,
})

function ValidateEmulator(emulator){
    const emulatorJoiSchema = Joi.object(
        {
            title: Joi.required(),
            description: Joi.String().min(10),
            image: Joi.String().min(8),
            console: Joi.String().min(2),
        }
    )
}