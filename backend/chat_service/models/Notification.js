const mongoose = require('mongoose')

const NotificationSchema = mongoose.Schema(
 {
    sendUserId:{
        type: String,
        required: true
    },
    receiveUserId:{
        type: String,
        required: true
    },
    sendUserName:{
        type: String,
        required: true
    },
    post:{
        type: String,
    },
    type: {
        type: Number
    }
 },
 {timestamps: true})

 module.exports = mongoose.model('Notification',NotificationSchema)