const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    likes : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }

    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    followings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]

})

const User = mongoose.model('User', userSchema);
module.exports = User;