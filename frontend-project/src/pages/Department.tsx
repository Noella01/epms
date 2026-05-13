import axios from "axios";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Department() {
  const [departmentCode, setDepartmentCode] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [grossSalary, setGrossSalary] = useState("");

  const addDepartment = async () => {
    try {
      const res = await axios.post(
        "http://localhost:500/department",
        {
          departmentCode,
          departmentName,
          grossSalary,
        },
        { withCredentials: true }
      );

      alert(res.data.message);
      if (res.data.success) {
        setDepartmentCode("");
        setDepartmentName("");
        setGrossSalary("");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to add department");
      } else {
        alert("Failed to add department");
      }
      console.log(error);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />

      <main className="form-card">
        <div className="form-heading">
          <span className="eyebrow">Department</span>
          <h1>Add Department</h1>
          <p>The department code saved here will appear in Employee.</p>
        </div>

        <div className="form-grid single-column">
          <label>
            Department Code 
            <input
              type="text"
              placeholder="Example: HR"
              value={departmentCode}
              onChange={(e) => setDepartmentCode(e.target.value)}
            />
          </label>

          <label>
            Department Name
            <input
              type="text"
              placeholder="Example: Human Resources"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
            />
          </label>

          <label>
            Gross Salary
            <input
              type="number"
              placeholder="Enter gross salary"
              value={grossSalary}
              onChange={(e) => setGrossSalary(e.target.value)}
            />
          </label>
        </div>

        <button className="primary-button" onClick={addDepartment}>
          Add Department
        </button>
      </main>
    </div>
  );
}
