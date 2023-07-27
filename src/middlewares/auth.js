const { Account } = require('../db/models')

const requireApiKey = async (req, res, next) => {
  const apiKey = req.get('x-api-key')
  const account = await Account.findOne({ apiKey })
  // TODO: remove isAdmin check
  if (!account || !account.isAdmin) {
    res.status(401).json({error: 'unauthorised'})
  } else {
    req.account = account
    next()
  }
}

module.exports = { requireApiKey }
