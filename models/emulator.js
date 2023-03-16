const mongoose = require('mongoose');
const Joi = require('joi');

const emulatorSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: String,
  image: String,
  website: String,
  rating: {type: Number, default: 0} // new field for rating with default value of 0
});

function ValidateEmulator(emulator){
  const emulatorJoiSchema = Joi.object(
    {
      name: Joi.required(),
      description: Joi.String().min(10),
      image: Joi.String().min(8),
      website: Joi.String().min(3),
      rating: Joi.Number().min(0).max(5) // validation for rating field
    }
  )
}

const Emulator = mongoose.model('Emulator', emulatorSchema)

module.exports = {Emulator, ValidateEmulator};
