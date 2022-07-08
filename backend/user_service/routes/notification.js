const router = require("express").Router();
const Notification = require('../models/Notification');
const User = require("../models/User");

//create a notification
router.post("/", async (req, res) => {
  const newNotification = new Notification({
    sendUserId: req.body.sendUserId,
    receiveUserId: req.body.receiveUserId,
    sendUserName: req.body.sendUserName,
    type: req.body.type,
    post: req.body.post
  });
  try {
    const savedNotification = await newNotification.save();
    res.status(200).json(savedNotification);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a request
router.delete("/", async (req, res) => {
    try {
      const deletedNotification = await Notification.findOne({
        sendUserId: req.body.sendUserId,
        receiveUserId: req.body.receiveUserId, 
        type: req.body.type
    });
      await deletedNotification.deleteOne();
      res.status(200).json('delete friend request successfully');
    } catch (err) {
        console.log(err)
      res.status(500).json(err);
    }
});

//get a request
router.get("/:sendUserId/:receiveUserId/:type", async (req, res) => {
    try {
      const FriendRequestNotification = await Notification.findOne({
          sendUserId: req.params.sendUserId,
          receiveUserId: req.params.receiveUserId,
          type: req.params.type
      });
      console.log(FriendRequestNotification)
      
      res.status(200).json(FriendRequestNotification);
    } catch (err) {
        console.log(err)
      res.status(500).json(err);
    }
  });


//get notifications by receiveUserId
router.get("/:receiveUserId", async (req, res) => {
  try {
    const Notifications = await Notification.find({
        receiveUserId: req.params.receiveUserId
    });
    res.status(200).json(Notifications);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;