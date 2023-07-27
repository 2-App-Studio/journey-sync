const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
    date: Date,
    text: String,
    accountRef: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
});

const Entry = mongoose.model('Entry', entrySchema);
module.exports = Entry
