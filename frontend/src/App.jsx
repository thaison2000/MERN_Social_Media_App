import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useContext } from "react";
import { Context } from "./context/Context";

function App() {

  const { user } = useContext(Context);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:username" element={<Profile />}/>
      </Routes>
    </Router>
  );
}

export default App;
