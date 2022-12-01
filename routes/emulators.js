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

//TODO: Add filters
router.get('/', async (req, res) => {
    const { title } = req.query;
    let filter = {};

    title ? filter.title = title : null;

    try {
        const emulators = await Emulator.find(title);
        res.json(emulators);
    }
    catch{
        res.status(404).json('Not found');
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