const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { config } = require('dotenv').config();
const { Emulator } = require('../models/emulator')

//TODO: PUT

function ValidateEmulator(emulator) {
    const emulatorJoiSchema = Joi.object(
        {
            name: Joi.required(),
            description: Joi.string().min(10),
            image: Joi.string().min(8),
            rating: Joi.Number().min(0).max(5) // validation for rating field
        }
    )
    return emulatorJoiSchema.validate(emulator);
}

router.get('/', async (req, res) => {
    const { name,console } = req.query;
    let filter = {};

    name ? filter.name = name : null;
    console ? filter.console = console : null;

    try {
        const emulators = await Emulator.find(filter);
        res.json(emulators);
    }
    catch {
        res.status(404).json('Not found');
    }
});

router.get('/:id', async (req, res) => {

    try {
        const emulator = await Emulator.findById(req.params.id);
        if (emulator) {
            res.json(emulator);
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

    let result = ValidateEmulator(req.body)

    if (result.error) {
        res.status(400).json(result.error);
        return;
    }

    let emulator = new Emulator(req.body);
    try {
        emulator = await emulator.save();
        res
            .location(`${emulator._id}`)
            .status(201)
            .json(emulator)
    }
    catch (error) {
        res.status(500).send('db_error ' + error)
    }

});

router.delete('/:id', async (req, res) => {
    try {
        const emulator = await Emulator.findByIdAndDelete(req.params.id);
        if (emulator)
            res.status(204).send();
        else
            res.status(404).json(`Emulator with ID ${req.params.id} not found`)
    }
    catch {
        res.status(404).json(`Error caused by ID: ${req.params.id}`);
    }
})

module.exports = router;
