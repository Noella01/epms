import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";


export default function App(){
  const [username, setUsername] = useState ("");
  const [password, setPassword] = useState ("");
  
const handleRegistration =async ()=>{
  try {
    const res =  await axios.post("http://localhost:500/register", 
       {username,password},
      {withCredentials:true});
      alert(res.data.message);
      if(res.data.success){
        window.location.href = "/";
      }
  } catch (error) {
    alert("Registration failed");
    console.log(error);
  }
}

  return(
    <div className="auth-page">
      <main className="auth-card">
        <span className="eyebrow">Create account</span>
        <h1>Registration</h1>

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

        <button className="primary-button" onClick={handleRegistration}>Register</button>
        <p>Have account <Link to="/">Login</Link></p>
      </main>
    </div>
  );
}
