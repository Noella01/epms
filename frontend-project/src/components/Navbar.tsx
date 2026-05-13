import { Link } from "react-router-dom";
import axios from "axios";

export default function Navbar(){
    const logout = async ()=>{
        await axios.get("http://localhost:500/logout", { withCredentials: true });
        window.location.href = "/";
    }
    return(
        <nav className="Navbar">
            <Link to="/Employee">Employee</Link> 
            <Link to="/Department">Department</Link>
            <Link to="/Salary">Salary</Link>
            <Link to="/Report">Report</Link>
            <button onClick={logout}>logout</button>
        </nav>
    );
}
