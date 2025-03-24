const Config = require('../models/config');
const asyncHandler = require('express-async-handler');

// Get Config - Ensure one object only
const getConfig = asyncHandler(async (req, res) => {
    const config = await Config.findOne();
    if (!config) {
        return res.status(404).json({error: 'Config not found'});
    }
    res.status(200).json({data: config});
});

// Update Config - Create if not exists, otherwise update
const updateConfig = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const updateData = req.body;

    const config = await Config.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });

    if (!config) {
        return res.status(404).json({error: 'Config not found'});
    }

    res.status(200).json({data: config, message: 'Config updated successfully'});
});

// Create Config
const createConfig = asyncHandler(async (req, res) => {
    const configData = req.body;
    const newConfig = new Config(configData);
    await newConfig.save();
    res.status(201).json({data: newConfig, message: 'Config created successfully'});
});

module.exports = {getConfig, updateConfig, createConfig};
