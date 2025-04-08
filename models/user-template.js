const mongoose = require('mongoose');

const userTemplateSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        template_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Template',
            required: true,
        },
        edited_object: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model('UserTemplate', userTemplateSchema);
