const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    // userAuth: {
    //     type: String,
    //     required: true,
    //     type: mongoose.Types.ObjectId, 
    //     refs: 'User'
    // },
    urlCode: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    url: {
        type: String,
        required: true
    },
    shortlink: {
        type: String,
        requird: true,
        unique: true
    }

}, { timestamps: true })
module.exports = mongoose.model('url', urlSchema)

