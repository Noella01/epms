import { BrowserRouter,Route,Routes } from "react-router-dom";
import Login from "./pages/Login";
import  Register  from "./pages/Register";
import  Employee  from "./pages/Employee";
import  Salary  from "./pages/Salary";
import  Report  from "./pages/Report";
import  Department  from "./pages/Department";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/Register" element={<Register/>}/>
        <Route path="/Employee" element={<Employee/>}/>
        <Route path="/Salary" element={<Salary/>}/>
        <Route path="/Report" element={<Report/>}/>
        <Route path="/Department" element={<Department/>}/>
      </Routes>
    </BrowserRouter>
  );
}