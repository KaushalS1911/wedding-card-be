const Config = require('../models/config');
const asyncHandler = require('express-async-handler');

// Get Config - Ensure one object only
const getConfig = asyncHandler(async (req, res) => {
    const config = await Config.findOne();
    if (!config) {
        return res.status(404).json({ success: false, error: 'Config not found' });
    }
    res.status(200).json({ success: true, data: config });
});

// Update Config - Create if not exists, otherwise update
const updateConfig = asyncHandler(async (req, res) => {
    const updateData = req.body;

    let config = await Config.findOne();

    if (config) {
        config = await Config.findByIdAndUpdate(config._id, updateData, {
            new: true,
            runValidators: true
        });
        return res.status(200).json({ success: true, data: config, message: 'Config updated successfully' });
    } else {
        const newConfig = new Config(updateData);
        await newConfig.save();
        return res.status(201).json({ success: true, data: newConfig, message: 'Config created successfully' });
    }
});

// Create Config - Prevent multiple configs
const createConfig = asyncHandler(async (req, res) => {
    const existingConfig = await Config.findOne();
    if (existingConfig) {
        return res.status(400).json({ success: false, error: 'Config already exists. Please update the existing config.' });
    }

    const configData = req.body;
    const newConfig = new Config(configData);
    await newConfig.save();
    res.status(201).json({ success: true, data: newConfig, message: 'Config created successfully' });
});

module.exports = {
    getConfig,
    updateConfig,
    createConfig
};
