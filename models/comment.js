const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    description: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})


const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment;