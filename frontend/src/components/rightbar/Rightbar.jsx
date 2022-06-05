import "./Rightbar.css";
import Online from "../online/Online";
import { useContext, useEffect, useState,useRef} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FlagIcon from '@mui/icons-material/Flag';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CancelIcon from '@mui/icons-material/Cancel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WallpaperIcon from '@mui/icons-material/Wallpaper';

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [followings, setFollowings] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isFriend, setIsFriend] = useState([]);
  const { user: currentUser, dispatch } = useContext(Context);
  const [profileUpdate, setProfileUpdate] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [addFriend, setAddFriend] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [background, setBackground] = useState(null);
  const city = useRef()
  const from = useRef()


  useEffect(()=>{
    setFollowed(currentUser.followings.includes(user?._id))
  },[currentUser,user?._id])

  useEffect(() => {
    const getFollowings = async () => {
      try {
        const followingList = await axios.get("http://localhost:8800/api/user/followings/" + user?._id);
        setFollowings(followingList.data);
      } catch (err) {
        console.log(err);
      }
    };
    if(user){
      getFollowings();

    }

  }, [user]);

  useEffect(()=>{
    setIsFriend(currentUser.friends.includes(user?._id))
  },[currentUser,user?._id])

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("http://localhost:8800/api/user/friends/" + user?._id);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    if(user){
      getFriends();

    }

  }, [user]);

  useEffect(() => {
    const getFriendRequest = async () => {
      try {
        const friendRequest = await axios.get("http://localhost:8800/api/friendRequest/" + currentUser._id + "/" + user?._id);
        if(friendRequest.data){
          setAddFriend(true)
        }
      } catch (err) {
        console.log(err);
      }
    };
    if(user){
      getFriendRequest();

    }

  }, [user]);

  const handleClickFollowOrUnfollow = async () => {
    try {
      if (followed) {
        await axios.put(`http://localhost:8800/api/user/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`http://localhost:8800/api/user/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
    }
  };

  const handleClickAddFriend = async () => {
    try {
      if (addFriend) {
        await axios.delete(`http://localhost:8800/api/friendRequest/`, {
          data: {
            sendUserId: currentUser._id,
            receiveUserId: user._id
          }
        });
      } else {
        await axios.post(`http://localhost:8800/api/friendRequest/`, {
          sendUserId: currentUser._id,
          receiveUserId: user._id
        });
      }
      setAddFriend(!addFriend)
    } catch (err) {
    }
  };

  const handleClickUnFriend = async () => {
    try {
      
        await axios.put(`http://localhost:8800/api/user/` + user._id + '/unfriend', {userId: currentUser._id,});
        await axios.delete(`http://localhost:8800/api/conversation/` + currentUser._id + '/' +  user._id);
        dispatch({ type: "UNFRIEND", payload: user._id });
        setIsFriend(!isFriend)
    } catch (err) {
    }
  };

  const handleClickUpdateProfile = async () => {
    try{
        setProfileUpdate((prevState)=>{
        return !prevState})
    }catch (err) {
    }
  };

  const handleSubmitFormUpdate = async (e) => {
    try{

        const updateUser = {
          userId: currentUser._id, 
          city: currentUser.city, 
          from: currentUser.from,
          avatar: currentUser.avatar,
          background: currentUser.background
        }
        if(city.current.value){
          updateUser.city = city.current.value
        }
        if(from.current.value){
          updateUser.from = from.current.value
        }
        if (avatar) {
          const data = new FormData();
          const fileName = Date.now() + avatar.name;
          updateUser.avatar = fileName
          data.append("name", fileName);
          data.append("file", avatar);
          try {
            await axios.post("http://localhost:8800/api/upload", data);
          } catch (err) {}
        }
        if (background) {
          const data = new FormData();
          const fileName = Date.now() + background.name;
          updateUser.background = fileName
          data.append("name", fileName);
          data.append("file", background);
          try {
            await axios.post("http://localhost:8800/api/upload", data);
          } catch (err) {}
        }
        const res = await axios.put("http://localhost:8800/api/user/"+ currentUser._id,updateUser);
        dispatch({type: 'UPDATE_PROFILE',payload: res.data});
        window.location.reload();
    }catch (err) {
      console.log(err)
    }
  };

  const ProfileUpdateRightbar = () => {
    return (
      <>
        <div className="rightbarProfileUpdate">
          <div className="rightbarProfileUpdateItem">
            <LocationCityIcon htmlColor="blue"/>
            <span className="rightbarProfileUpdateItemTitle">City</span>
            <input type="text" className="profileUpdateInput" ref={city} />
          </div>
          <div className="rightbarProfileUpdateItem">
            <FlagIcon htmlColor="brown"/>
            <span className="rightbarProfileUpdateItemTitle">From</span>
            <input type="text" className="profileUpdateInput" ref={from}/>
          </div>
          <div className="rightbarProfileUpdateItem">
            <AccountCircleIcon htmlColor="green"/>
            <span className="rightbarProfileUpdateItemTitle">Avatar</span>
            <label htmlFor="avatar" className="uploadIcon"><CloudUploadIcon/></label>
            <input 
                className="profileUpdateInput"
                type="file"
                id="avatar"
                style={{ display: "none" }}
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setAvatar(e.target.files[0])}  
                />
          </div>
          {avatar && (
              <div className="imgContainer">
              <img className="uploadImg" src={URL.createObjectURL(avatar)} alt="" />
              <CancelIcon className="CancelImg" onClick={() => setAvatar(null)} htmlColor='red'/>
              </div>
            )}
          <div className="rightbarProfileUpdateItem">
            <WallpaperIcon htmlColor="yellow"/>
            <span className="rightbarProfileUpdateItemTitle">Background</span>
            <label htmlFor="background" className="uploadIcon"><CloudUploadIcon/></label>
            <input 
                className="profileUpdateInput"
                type="file"
                style={{ display: "none" }}
                id="background"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setBackground(e.target.files[0])}  
                />
          </div>
          {background && (
              <div className="imgContainer">
              <img className="uploadImg" src={URL.createObjectURL(background)} alt="" />
              <CancelIcon className="CancelImg" onClick={() => setBackground(null)} htmlColor='red'/>
              </div>
            )}
          <button className="profileUpdateSubminButton" onClick={handleSubmitFormUpdate}>Update</button>
        </div>
      </>
    )
  }

  const HomeRightbar = () => {
    return (
      <>
        <div className="AdContainer">
          <span className="AdText">
            <b>Connect</b> friend all around the world on <b>ThaiSonSocial</b>
          </span>
        </div>
        <img className="rightbarAd" src= {PF + "layout/ConnectFriend.jpg"} alt="" />
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClickFollowOrUnfollow}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <RemoveIcon /> : <AddIcon />}
          </button>
        )}
        {user.username !== currentUser.username && (isFriend ?
          <button className="rightbarFollowButton" onClick={handleClickUnFriend}>
            Unfriend
            <RemoveIcon />
          </button>: 
          <button className="rightbarFollowButton" onClick={handleClickAddFriend}>
            {addFriend ? "Waiting for friend's acceptance" : "Add friend"}
            {addFriend ? <RemoveIcon /> : <AddIcon />}
          </button>)}
         {user.username == currentUser.username && (
          <button className="rightbarUpdateProfileButton" onClick={handleClickUpdateProfile}>
            Update Profile
          </button>
        )}
        {profileUpdate? <ProfileUpdateRightbar/>: null}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User followings</h4>
        <div className="rightbarFollowings">
          {followings.map((following) => (
            <Link
              key={following._id}
              to={"/profile/" + following.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    following.avatar
                      ? PF + following.avatar
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{following.username}</span>
              </div>
            </Link>
          ))}
        </div>
        <h4 className="rightbarTitle">Friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              key={friend._id}
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.avatar
                      ? PF + friend.avatar
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}