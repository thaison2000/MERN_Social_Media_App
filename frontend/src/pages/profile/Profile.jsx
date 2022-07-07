import "./Profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState,useRef,useContext } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { io } from "socket.io-client";
import { Context } from "../../context/Context";

export default function Profile() {
  const [user, setUser] = useState();
  const username = useParams().username;
  const {user: currentUser} = useContext(Context);

  const socket = useRef()

  useEffect(() => {
    socket.current = io("http://localhost:3004");
    socket.current.emit("addUser", currentUser._id);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`http://localhost:3001/api/user?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  const updateProfile = (data) =>{
    setUser(data)
  }

  return (
    <>
      <Topbar socket={socket}/>
      {user?
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  user.background
                    ? 'http://localhost:3001/user/images/' + user.background
                    : 'http://localhost:3001/user/images/person/noCover.png'
                }
                alt=""
              />
              <img
                className="profileUserImg"
                src={
                  user.avatar
                    ? 'http://localhost:3001/user/images/' + user.avatar
                    : 'http://localhost:3001/user/images/person/noAvatar.png'
                }
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} socket={socket}/>
            <Rightbar user={user} updateProfile={updateProfile}/>
          </div>
        </div>
      </div>:null}
    </>
  );
}