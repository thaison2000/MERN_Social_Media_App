import "./Post.css";
import { useContext, useEffect, useState,useRef } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SendIcon from '@mui/icons-material/Send';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function Post({ post }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [currentPost, setCurrentPost] = useState(post);
  const [likes, setLikes] = useState(post.likes.length);
  const [comments, setComments] = useState([]);
  const [commentusers, setCommentUsers] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [commentComponent,setCommentComponent] = useState(false)
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(Context);
  const comment = useRef()

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, []);

  //lay thong tin nguoi dang bai
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`http://localhost:8800/api/user?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, []);

  //lay cac comment thuoc bai dang
  useEffect(() => {
    const fetchComments = async () => {
      const res = await axios.get("http://localhost:8800/api/comment/" + post._id);
      const commentsSort = res.data.comments.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      })
      setComments(commentsSort);
      setCommentUsers(res.data.users);
    };
    fetchComments();
  }, []);

  //xu ly xoa bai dang
  const handlePostDelete = async () =>{
    try {
      await axios.delete("http://localhost:8800/api/post/"+ post._id, { data: {userId: currentUser._id} });
      setCurrentPost(null)
    } catch (err) {
      console.log(err)
    }
  }

  //xu ly khi like bai dang
  const handleClickLike = () => {
    try {
      axios.put("http://localhost:8800/api/post/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  //xu ly khi comment bai dang
  const handleCommmentSubmit = async () =>{
    try {
      const newComment = { userId: currentUser._id ,postId: post._id,desc: comment.current.value}
      const res = await axios.post("http://localhost:8800/api/comment", newComment);
      setComments([res.data,...comments])
      setCommentUsers([...commentusers,currentUser])
    } catch (err) {
      console.log(err)
    }
  }

  //xu ly khi xoa comment
  const handleCommmentDelete = async (deleteComment) =>{
    try {
      await axios.delete("http://localhost:8800/api/comment/"+ deleteComment._id,{data: {userId: currentUser._id}});
      setComments(comments.filter((comment)=>{
        return comment != deleteComment
      }))
    } catch (err) {
      console.log(err)
    }
  }

  const PostCommentComponent = () =>{
    return (
      <>
      <div className="postComment">
      <div className="postCommentInputWrapper">
        <input type="text" className="postCommentInput" placeholder=" Write your comment ..." ref={comment}/>
        <SendIcon onClick={handleCommmentSubmit} htmlColor='LightSeaGreen' />
      </div>
      <div className="postCommentsWrapper">
        {
          comments.map((comment)=>{
            let user = {}
            for(let i=0;i<commentusers.length;i++){
              if(commentusers[i]._id == comment.userId ){
                user = commentusers[i]
              }
            }
            return (
              <div className="userComments" key={comment._id}>
                <img 
                  src={
                    user.avatar
                      ? PF + user.avatar
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="userCommentImg"
                />
                <div className="userCommentNameWraper">
                <span className="userCommentName">{user.username}</span>
                <span className="postDate">{format(comment.createdAt)}</span>
                </div>
                <div className="userCommentDesc">{comment.desc}</div>
                {comment.userId==currentUser._id ? <DeleteForeverIcon onClick={()=>{handleCommmentDelete(comment)}} htmlColor='red'/>:null}
              </div>
            )
          })
        }
      </div>
      </div>
    </>
    )
  }

  return (
    <div className="post">
      {currentPost?
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.avatar
                    ? PF + user.avatar
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            {post.userId == currentUser._id ? <DeleteForeverIcon htmlColor="red" onClick={handlePostDelete}/>: null}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={post.img? PF + post.img: null} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {isLiked ? 
            <ThumbUpIcon
              htmlColor="DodgerBlue"
              className="likeIcon"
              onClick={handleClickLike}
              alt=""
            />:
            <ThumbUpIcon
            htmlColor="gray"
            className="likeIcon"
            onClick={handleClickLike}
            alt=""
          />}
            <span className="postLikeCounter">{likes} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText" onClick={()=>{setCommentComponent(!commentComponent)}} >{comments.length} comments</span>
          </div>
        </div>
        {commentComponent? <PostCommentComponent/>: null}
      </div>: null}
    </div>
  );
}