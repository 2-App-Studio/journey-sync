const express = require('express')
const mongoose = require('mongoose')
const { Account } = require('../db/models')
const { requireApiKey } = require('../middlewares/auth')
const { ExternalError } = require('../helper/error')
const Joi = require('joi')

const router = express.Router()

const createAccountSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    displayName: Joi.string()
        .min(3)
        .max(30)
        .required(),
}).options({ stripUnknown: true })

router.post('/', async (req, res, next) => {
  const { value, error } = createAccountSchema.validate(req.body)
  if (error) {
    next(new ExternalError(error.message))
    return
  }

  const existing = await Account.findOne({ username: value.username })
  if (existing) {
    next(new ExternalError('username in use'))
    return
  }
  
  const user = new Account(value);
  try {
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error)
    next(error);
  }
})

router.use(requireApiKey)

router.get('/:userId', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      throw new ExternalError('user not found', 404)
    }
    const user = await Account.findById(req.params.userId);
    if (!user) {
      throw new ExternalError('user not found', 404)
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
})

router.get('/', async (req, res, next) => {
  try {
    const users = await Account.find({});
    res.send(users);
  } catch (error) {
    next(error);
  }
})


module.exports = router
