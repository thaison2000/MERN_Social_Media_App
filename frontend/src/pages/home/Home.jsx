import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./Home.css"
import { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { Context } from "../../context/Context";

export default function Home() {

  const [socket, setSocket] = useState(null);
  const {user} = useContext(Context);

  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  useEffect(() => {
    socket?.emit("newUser", user);
  }, [socket, user]);

  if(socket== null){
    return (<div>Loading</div>)
  }
  return (
    <>
      <Topbar socket={socket}/>
      <div className="homeContainer">
        <Sidebar />
        <Feed socket={socket}/>
        <Rightbar/>
      </div>
    </>
  );
}