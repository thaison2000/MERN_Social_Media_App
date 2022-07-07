const mongoose = require('mongoose')

const FriendRequestSchema = mongoose.Schema(
 {
    sendUserId:{
        type: String,
        required: true
    },
    receiveUserId:{
        type: String,
        required: true
    }
 },
 {timestamps: true})

 module.exports = mongoose.model('FriendRequest',FriendRequestSchema)