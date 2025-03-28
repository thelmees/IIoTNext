import React, { useState } from 'react'
import './login.css'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../Redux/Slices/authSlice';
import { Message } from 'primereact/message';

function Login() {

  const navigate = useNavigate()

  const [credentials, setCredentials] = useState({username:"",password:""});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch()
  const {token,loading,error} = useSelector((state)=>state.auth)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    setCredentials({...credentials,[e.target.name]:e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

      dispatch(loginUser(credentials)).then((res)=>{
        if (res.meta.requestStatus === "fulfilled") navigate("/deviceList");
      })
  }
  
  return (
    <div className='login-container'>
    <div className='login-content'>
      <h1>Login</h1>
      <form action="">
        <div className="login-inputs">
          <div className="login-input">
            <input type="text" name='username' placeholder='Username' onChange={handleChange} required />
          </div>
          <div className="login-input password-field">
            <input type={showPassword ? 'text':'password'} name='password' placeholder='Password' onChange={handleChange} required />
            <button type="button"  className="eye-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button onClick={handleSubmit} className='logbtn' type='submit'>Login</button>
        </div>
      </form>
    </div>
      {error && <Message severity="error" text={error} />}
    </div>
  )
}

export default Login