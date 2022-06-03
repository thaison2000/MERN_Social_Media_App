import "./Topbar.css";
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom";
import { useContext,useRef } from "react";
import { Context } from "../../context/Context";
import axios from "axios";

export default function Topbar() {
  const { user,dispatch } = useContext(Context);
  const  usernameSearch = useRef();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  let navigate = useNavigate()

  const handleClickLogout = (e)=>{
    dispatch({ type: "LOG_OUT" });
    navigate('/')
  }

  const handleClickSearch = async (e)=>{
    try{
      const res = await axios.get(`http://localhost:8800/api/user?username=${usernameSearch.current.value}`);
      navigate(`/profile/${usernameSearch.current.value}`)
    }
    catch(err){
      alert('Không tồn tại username')
    }
  }

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">ThaiSonSocial</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <SearchIcon className="searchIcon" onClick={handleClickSearch}/>
          <input
            placeholder="Search for friends"
            className="searchInput"
            ref = {usernameSearch}
          />
        </div>
      </div>
      <div className="topbarRight">
          <Link to={'/profile/'+ user.username}>
          <img
            src={
              user.avatar
                ? PF + user.avatar
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
          </Link>
        <span className="topbarRightLogout" onClick={handleClickLogout}>Log out</span>
      </div>
    </div>
  );
}