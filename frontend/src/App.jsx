import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/Messenger";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useContext,useRef,useEffect } from "react";
import { Context } from "./context/Context";
import { io } from "socket.io-client";

function App() {

  const { user } = useContext(Context);
  const socket = useRef()

  useEffect(() => {
    socket.current = io("http://localhost:3004");
    socket.current.emit("addUser", user?._id);
  }, [user]);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home socket={socket}/> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:username" element={user ? <Profile socket={socket}/> : <Login/>}/>
        <Route path="/messenger" element={user ? <Messenger socket={socket}/> : <Login/>}/>
      </Routes>
    </Router>
  );
}

export default App;
