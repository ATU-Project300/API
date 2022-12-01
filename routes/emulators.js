const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { config } = require('dotenv').config();
const { Emulator } = require('../models/emulator')

//TODO: GET by ID, DELETE, PUT

function ValidateEmulator(emulator) {
    const emulatorJoiSchema = Joi.object(
        {
            title: Joi.required(),
            description: Joi.string().min(10),
            image: Joi.string().min(8),
            console: Joi.string().min(2),
        }
    )
    return emulatorJoiSchema.validate(emulator);
}

//TODO: Add filters
router.get('/', async (req, res) => {
    const { title } = req.query;
    let filter = {};

    title ? filter.title = title : null;

    try {
        const emulators = await Emulator.find(title);
        res.json(emulators);
    }
    catch {
        res.status(404).json('Not found');
    }
});

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