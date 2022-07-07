import "./Topbar.css";
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom";
import { useContext,useRef,useState,useEffect } from "react";
import { Context } from "../../context/Context";
import axios from "axios";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { format } from "timeago.js";

export default function Topbar({socket}) {
  const { user,dispatch } = useContext(Context);
  const [friendRequestAlert, setFriendRequestAlert] = useState(false);
  const [friendRequestUsers, setFriendRequestUsers] = useState([]);
  const [notificationAlert, setNotificationAlert] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState();
  const  usernameSearch = useRef();

  let navigate = useNavigate()

  useEffect(() => {
        const getFriendRequestUsers = async () => {
          try {             
            const userList = await axios.get("http://localhost:3001/api/friendRequest/user/list/" + user?._id);
            setFriendRequestUsers(userList.data);
          } catch (err) {
            console.log(err);
          }
        };
        if(user){
          getFriendRequestUsers();
    
        }
    
      }, [user]);

  useEffect(() => {
        socket.current?.on("getNotification", (data) => {
          console.log(data)
          setNewNotification({
            senderName: data.senderName,
            type: data.type,
            text: data.text,
            timestamp: data.timestamp
          })
        });
      }, [socket.current]);

  useEffect(() => {
        newNotification &&
          setNotifications((prev) => [...prev, newNotification]);
      }, [newNotification]);
    

    const handleClickAcceptAddFriend = async (deletefriendRequestUser) => {
        try {
            await axios.put(`http://localhost:3001/api/user/` + user._id +'/addfriend', {userId: deletefriendRequestUser._id,});
            await axios.delete(`http://localhost:3001/api/friendRequest`, {
              data: {
                sendUserId: deletefriendRequestUser._id,
                receiveUserId: user._id
              }
            });
            await axios.post(`http://localhost:3003/api/conversation/`, {firstUserId: deletefriendRequestUser._id,secondUserId: user._id});
          setFriendRequestUsers(friendRequestUsers.filter((friendRequestUser)=>{
            return friendRequestUser != deletefriendRequestUser
          }))
          dispatch({ type: "ADDFRIEND", payload: deletefriendRequestUser._id });
        } catch (err) {
        }
      };

    const handleClickRejectAddFriend = async (deletefriendRequestUser) => {
        try {
            await axios.delete(`http://localhost:3001/api/friendRequest`, {
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

  const handleClickNotificationAlert = ()=>{
    setNotificationAlert(!notificationAlert)
  }


  const handleClickLogout = (e)=>{
    dispatch({ type: "LOG_OUT" });
    navigate('/')
  }

  const handleClickSearch = async (e)=>{
    try{
      const res = await axios.get(`http://localhost:3001/api/user?username=${usernameSearch.current.value}`);
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


  const NotificationAlertContainer = () => {
    return (
      <div className='notificationAlert'>
            {notifications.map((notification)=> {
              console.log('gg')
              let action;

              if (notification.type === 1) {
                action = "liked";
              } 
              else{
                action = "commented";
              }
              return (
              <div className="notificationAlertItem">
              <span className="notificationAlertItemDesc">{`${notification.senderName} ${action} your post:  "${notification.text.substring(0,50)}..."`}</span>
              <div className="notificationDate">{format(notification.timestamp)}</div>
              </div>
            )} )}
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
          <div className="topbarRightNotificationAlert" onClick={handleClickNotificationAlert}>
            <NotificationsIcon/>
            <span className="topbarRightNotificationAlertIconBadge">{notifications.length}</span>
            {notificationAlert ? <NotificationAlertContainer/>: null}
          </div>
          <div className="topbarRightFriendRequestAlert" onClick={handleClickFriendRequestAlert}>
            <GroupAddIcon/>
            <span className="topbarRightFriendRequestAlertIconBadge">{friendRequestUsers.length}</span>
            {friendRequestAlert ? <FriendRequestAlertContainer/>: null}
          </div>
          <Link to={'/profile/'+ user.username}>
          <img
            src={
              user.avatar
                ? 'http://localhost:3001/user/images/' + user.avatar
                : 'http://localhost:3001/user/images/person/noAvatar.png'
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