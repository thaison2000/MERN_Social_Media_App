const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment")

//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like / dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts
router.get("/timeline/:id", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const userPosts = await Post.find({ userId: currentUser._id });
    const followingPosts = await Promise.all(
      currentUser.followings.map((followingId) => {
        return Post.find({ userId: followingId });
      })
    );
    const friendPosts = await Promise.all(
      currentUser.friends.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    let post = userPosts.concat(...followingPosts).concat(...friendPosts)

    //loai bo bai viet trung lap
    let timelinePost = []
    timelinePost = post.filter(function (item) {
      return timelinePost.includes(item) ? '' : timelinePost.push(item)
    })

    let value = []
    for(let i=0;i<timelinePost.length;i++){
      const comments = await Comment.find({ postId: timelinePost[i]._id });
      const user = await User.findById(timelinePost[i].userId)

      value.push({
        _id: timelinePost[i]._id,
        userId: timelinePost[i].userId,
        user: user,
        desc: timelinePost[i].desc,
        likes: timelinePost[i].likes,
        createdAt: timelinePost[i].createdAt,
        updatedAt: timelinePost[i].updatedAt,
        comments: comments,
        img: timelinePost[i].img
      })

    }
    res.status(200).json(value);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user's all posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });

    let value = []
    for(let i=0;i<posts.length;i++){
      const comments = await Comment.find({ postId: posts[i]._id });

      value.push({
        _id: posts[i]._id,
        userId: posts[i].userId,
        desc: posts[i].desc,
        likes: posts[i].likes,
        createdAt: posts[i].createdAt,
        updatedAt: posts[i].updatedAt,
        comments: comments,
        img: posts[i].img
      })
    }
    res.status(200).json(value);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;