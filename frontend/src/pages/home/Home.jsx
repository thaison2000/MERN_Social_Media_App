import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./Home.css"
import { useRef,useEffect,useContext } from "react";
import { Context } from "../../context/Context";
import { io } from "socket.io-client";

export default function Home() {

  const { user } = useContext(Context);
  const socket = useRef()

  useEffect(() => {
    socket.current = io("http://localhost:3004");
    socket.current.emit("addUser", user._id);
  }, [user]);
  
 
  return (
    <>
      <Topbar socket = {socket} />
      <div className="homeContainer">
        <Sidebar />
        <Feed socket = {socket}/>
        <Rightbar/>
      </div>
    </>
  );
}