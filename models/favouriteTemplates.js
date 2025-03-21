const mongoose = require('mongoose');

const favouriteTemplateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const FavouriteTemplate = mongoose.model('FavouriteTemplate', favouriteTemplateSchema);
module.exports = FavouriteTemplate;
