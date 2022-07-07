import axios from "axios";
import { useEffect, useState } from "react";
import "./Conversation.css";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios("http://localhost:3001/api/user?userId=" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={
          user?.avatar
            ? 'http://localhost:3001/user/images/' + user.avatar
            : 'http://localhost:3001/user/images/person/noAvatar.png'
        }
        alt=""
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}