const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    company_details: {type: Object, default: {}},
}, {timestamps: true});

configSchema.statics.getConfig = async function () {
    let config = await this.findOne();
    if (!config) {
        config = await this.create({});
    }
    return config;
};

configSchema.statics.updateConfig = async function (newData) {
    const config = await this.getConfig();
    Object.assign(config.company_details, newData);
    await config.save();
    return config;
};

const Config = mongoose.model('Config', configSchema);
module.exports = Config;
