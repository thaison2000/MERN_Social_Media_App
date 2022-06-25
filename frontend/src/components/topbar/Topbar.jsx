import "./Topbar.css";
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom";
import { useContext,useRef,useState,useEffect } from "react";
import { Context } from "../../context/Context";
import axios from "axios";
import GroupAddIcon from '@mui/icons-material/GroupAdd';

export default function Topbar() {
  const { user,dispatch } = useContext(Context);
  const [friendRequestAlert, setFriendRequestAlert] = useState(false);
  const [friendRequestUsers, setFriendRequestUsers] = useState([]);
  const  usernameSearch = useRef();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    user.socket?.on("getNotification", (data) => {
      setNotifications((prev) => [...prev, data].reduce((acc, current) => {
        const x = acc.find(item => item.timestamp === current.timestamp);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []));
    });
  }, [user.socket]);

  const displayNotification = ({ senderId }) => {
    return (
      <span className="notification">{`${senderId} like your post.`}</span>
    );
  };

  const handleRead = () => {
    setNotifications([]);
    setOpen(false);
  };

  let navigate = useNavigate()

  useEffect(() => {
        const getFriendRequestUsers = async () => {
          try {             
            const userList = await axios.get("http://localhost:8800/api/friendRequest/user/list/" + user?._id);
            setFriendRequestUsers(userList.data);
          } catch (err) {
            console.log(err);
          }
        };
        if(user){
          getFriendRequestUsers();
    
        }
    
      }, [user]);
    

    const handleClickAcceptAddFriend = async (deletefriendRequestUser) => {
        try {
            await axios.put(`http://localhost:8800/api/user/` + user._id +'/addfriend', {userId: deletefriendRequestUser._id,});
            await axios.delete(`http://localhost:8800/api/friendRequest`, {
              data: {
                sendUserId: deletefriendRequestUser._id,
                receiveUserId: user._id
              }
            });
            await axios.post(`http://localhost:8800/api/conversation/`, {firstUserId: deletefriendRequestUser._id,secondUserId: user._id});
          setFriendRequestUsers(friendRequestUsers.filter((friendRequestUser)=>{
            return friendRequestUser != deletefriendRequestUser
          }))
          dispatch({ type: "ADDFRIEND", payload: deletefriendRequestUser._id });
        } catch (err) {
        }
      };

    const handleClickRejectAddFriend = async (deletefriendRequestUser) => {
        try {
            await axios.delete(`http://localhost:8800/api/friendRequest`, {
              data: {
                sendUserId: deletefriendRequestUser._id,
                receiveUserId: user._id
              }
            });
          setFriendRequestUsers(friendRequestUsers.filter((friendRequestUser)=>{
            return friendRequestUser != deletefriendRequestUser
          }))
        } catch (err) {
        }
    };
  
  const handleClickFriendRequestAlert = ()=>{
    setFriendRequestAlert(!friendRequestAlert)
  }


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

  

  const FriendRequestAlertContainer = () => {
    return (
      <div className='friendRequestAlert'>
          {friendRequestUsers? 
          friendRequestUsers.map((friendRequestUser)=>{
              return (
                  <div className="friendRequestAlertItem" key={friendRequestUser._id}>
                      <span className="friendRequestAlertItemDesc">You have a <b>friend request</b> from <b>{friendRequestUser.username}</b></span>
                      <div className="friendRequestAlertItemButtons">
                          <button className='friendRequestAlertItemButton' onClick={()=>{handleClickAcceptAddFriend(friendRequestUser)}}>Accept</button>
                          <button className='friendRequestAlertItemButton' onClick={()=>{handleClickRejectAddFriend(friendRequestUser)}}>Reject</button>
                      </div>
                      
                  </div>
              )
          }): null
          }
      </div>
    )
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
      <div className="icons">
      <div className="icon" onClick={() => setOpen(!open)}>
          <GroupAddIcon/>
          {
            notifications.length >0 &&
            <div className="counter">{notifications.length}</div>
          }
        </div>
      </div>
      {open && (
        <div className="notifications">
          {notifications.map((n) => displayNotification(n))}
          <button className="nButton" onClick={handleRead}>
            Mark as read
          </button>
        </div>
      )}
          <div className="topbarRightFriendRequestAlert" onClick={handleClickFriendRequestAlert}>
            <GroupAddIcon/>
            <span className="topbarRightFriendRequestAlertIconBadge">{friendRequestUsers.length}</span>
            {friendRequestAlert ? <FriendRequestAlertContainer/>: null}
          </div>
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