import { useContext, useRef } from "react";
import "./Login.css";
import { Context } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {

    let navigate = useNavigate()

    const email = useRef();
    const password = useRef();
    const { dispatch } = useContext(Context);

    const handleClickLogin = async (e) => {
        e.preventDefault();
    
        try{
            const res = await axios.post("http://localhost:8800/api/auth/login",{ email: email.current.value, password: password.current.value });
            dispatch({type: 'LOG_IN',payload: res.data});
            navigate('/')
        } 
        catch(err){
            console.log(err)
        }
    };

  const handleClickCreateNewAccount = (e) =>{
      navigate('/register')
  }

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">ThaiSonSocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on ThaiSonSocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClickLogin}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit">Log in</button>
            <button className="loginRegisterButton" onClick={handleClickCreateNewAccount}>Create new account</button>
          </form>
        </div>
      </div>
    </div>
  );
}