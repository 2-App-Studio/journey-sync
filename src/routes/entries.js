const express = require('express')
const mongoose = require('mongoose')
const { Entry } = require('../db/models')
const { ExternalError } = require('../helper/error')
const Joi = require('joi')

const router = express.Router()

const createEntrySchema = Joi.object({
    text: Joi.string()
        .max(256)
        .required(),
    date: Joi.date(),
}).options({ stripUnknown: true })

router.post('/', async (req, res, next) => {
  const { value, error } = createEntrySchema.validate(req.body)
  if (error) {
    next(new ExternalError(error.message))
    return
  }

  value.accountRef = req.account._id
  
  const entry = new Entry(value);
  try {
    await entry.save();
    res.send(entry);
  } catch (error) {
    next(error);
  }
})

router.get('/:entryId', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.entryId)) {
      throw new ExternalError('entry not found', 404)
    }
    const entry = await Entry.findById(req.params.entryId).populate('accountRef')
    if (!entry) {
      throw new ExternalError('entry not found', 404)
    }
    res.send(entry);
  } catch (error) {
    next(error);
  }
})

router.get('/', async (req, res, next) => {
  try {
    const entries = await Entry.find({}).populate('accountRef')
    res.send(entries);
  } catch (error) {
    next(error);
  }
})


module.exports = router
