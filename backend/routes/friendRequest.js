const router = require("express").Router();
const FriendRequest = require('../models/FriendRequest');
const User = require("../models/User");

//create a request
router.post("/", async (req, res) => {
  const newRequest = new FriendRequest(req.body);
  try {
    const savedRequest = await newRequest.save();
    res.status(200).json(savedRequest);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a request
router.delete("/", async (req, res) => {
    try {
      const deletedRequest = await FriendRequest.findOne({sendUserId: req.body.sendUserId,receiveUserId: req.body.receiveUserId});
      await deletedRequest.deleteOne();
      res.status(200).json('delete friend request successfully');
    } catch (err) {
        console.log(err)
      res.status(500).json(err);
    }
  });

//get a request
router.get("/:sendUserId/:receiveUserId", async (req, res) => {
    try {
      const Request = await FriendRequest.findOne({
          sendUserId: req.params.sendUserId,
          receiveUserId: req.params.receiveUserId
      });
      res.status(200).json(Request);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//get requests by receiveUserId
router.get("/:receiveUserId", async (req, res) => {
    try {
      const Requests = await FriendRequest.find({
          reciverUserId: req.params.sendUserId
      });
      res.status(200).json(Requests);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //get list user send request to current user
router.get("/user/list/:receiveUserId", async (req, res) => {
    try {
      const userList = []
      const Requests = await FriendRequest.find({
          reciverUserId: req.params.sendUserId
      });
      for(let i =0;i<Requests.length;i++){
          const user = await User.findById(Requests[i].sendUserId)
          userList.push(user)
      }
      res.status(200).json(userList);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;
