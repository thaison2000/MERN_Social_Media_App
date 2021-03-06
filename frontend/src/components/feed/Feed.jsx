import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./Feed.css";
import axios from "axios";
import { Context } from "../../context/Context";

export default function Feed({ socket,username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(Context);

  //lay tat ca bai dang hoac bai dang cua nguoi dung
  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("http://localhost:3002/api/post/profile/" + username)
        : await axios.get("http://localhost:3002/api/post/timeline/" + user._id);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((post) => {
          return (
          <Post key={post._id} post={post} socket={socket} />
        )})}
      </div>
    </div>
  );
}