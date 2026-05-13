import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";


export default function App(){
  const [username, setUsername] = useState ("");
  const [password, setPassword] = useState ("");
  
const handleLogin =async ()=>{
  try {
    const res =  await axios.post("http://localhost:500/login", 
       {username,password},
      {withCredentials:true});
       alert(res.data.message);
  
      if(res.data.success){
        window.location.href = "/Employee"; 
      }
  } catch (error) {
    alert("Login failed");
    console.log(error);
    }
};

  return(
    <div className="auth-page">
      <main className="auth-card">
        <span className="eyebrow">Welcome back</span>
        <h1>Login</h1>

        <label>
          Username
          <input
            type="text"
            value={username}
            placeholder="Enter username"
            onChange={(e)=>setUsername(e.target.value)}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e)=>setPassword(e.target.value)}
          />
        </label>

        <button className="primary-button" onClick={handleLogin}>Login</button>
        <p>Don't have account <Link to="/Register">Register</Link></p>
      </main>
    </div>
  );
}
