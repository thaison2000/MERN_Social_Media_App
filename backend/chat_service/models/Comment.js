const mongoose = require('mongoose')

const CommentSchema = mongoose.Schema(
 {
    userId:{
        type: String,
        required: true
    },
    postId:{
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    }
 },
 {timestamps: true})

 module.exports = mongoose.model('Comment',CommentSchema)