import "./Message.css";
import { format } from "timeago.js";
import { useState, useEffect } from "react";
import axios from "axios";


export default function Message({ message, own }) {
  const [user, setUser] = useState();

  useEffect(() => {

    const getUser = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/user?userId=" + message.sender);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);


  return (
    <div className={own ? "message own" : "message"}>
      {user? <><div className="messageTop">
        <img
          className="messageImg"
          src={user.avatar
            ? 'http://localhost:3001/user/images/' + user.avatar
            : 'http://localhost:3001/user/images/person/noAvatar.png'}
          alt="" />
        <p className="messageText">{message.text}</p>
      </div><div className="messageBottom">{format(message.createdAt)}</div></>: null}
    </div>
  );
}