const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String, 
        required: true, 
        unique: true, 
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    },
    password: {
        type: String, 
        required: true
    },
    name: {
        type: String, 
        required: true
    },
    gender: {
        type: String, 
        required: true
    },
    date: {
        type: Date, 
        default: Date.now
    },
    role: {
        type: String, 
        required: true
    },
    verified: {
        type: Boolean, 
        required: true
    },
    verificationToken: String, 
    crushes: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    ],
    receivedCrushes: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    ],
    matches: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    ],
    profileImages: [
        {
            type: String
        }
    ],
    description: {
        type: String
    },
    turnOns: [
        {
            type: String
        }
    ],
    lookingFor: [
        {
            type: String
        }
    ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;