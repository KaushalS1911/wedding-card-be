const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    company_details: {type: Object, default: {}},
    types: {type: [String], default: []}
}, {timestamps: true});

module.exports = mongoose.model('Config', configSchema);
