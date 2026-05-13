import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

type Department = {
  departmentCode: string;
  departmentName: string;
};

export default function Employee() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentStatus, setDepartmentStatus] = useState("Loading departments...");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState(""); 
  const [address, setAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [gender, setGender] = useState("");
  const [hiredDate, setHiredDate] = useState("");
  const [department, setDepartment] = useState("");

  const getDepartments = async () => {
    try {
      setDepartmentStatus("Loading departments...");
      const res = await axios.get("http://localhost:500/department", {
        withCredentials: true,
      });

      if (Array.isArray(res.data)) {
        setDepartments(res.data);
        setDepartmentStatus(
          res.data.length > 0
            ? "Choose the department that was added in Department."
            : "No departments found. Add one in Department first."
        );
      } else {
        setDepartmentStatus(res.data.message || "Failed to load departments.");
      }
    } catch (error) {
      setDepartmentStatus("Failed to load departments. Please login again.");
      console.log(error);
    }
  };

  const addEmployee = async () => {
    if (!department) {
      alert("Please select a department from the database list.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:500/employee",
        {
          firstName,
          lastName,
          position,
          address,
          telephone,
          gender,
          hiredDate,
          department,
        },
        { withCredentials: true }
      );

      alert(res.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to add employee");
      } else {
        alert("Failed to add employee");
      }
      console.log(error);
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);

  return (
    <div className="page-shell">
      <Navbar />

      <main className="form-card employee-card">
        <div className="form-heading">
          <span className="eyebrow">Employee</span>
          <h1>Employee Registration</h1>
          <p>Add employee details and link them to an existing department.</p>
        </div>

        <div className="form-grid">
          <label>
            First Name
            <input
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>

          <label>
            Last Name
            <input
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>

          <label>
            Position
            <input
              type="text"
              placeholder="Enter position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </label>

          <label>
            Address
            <input
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>

          <label>
            Telephone
            <input
              type="text"
              placeholder="Enter telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
            />
          </label>

          <label>
            Gender
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>

          <label>
            Hired Date
            <input
              type="date"
              value={hiredDate}
              onChange={(e) => setHiredDate(e.target.value)}
            />
          </label>

          <label>
            Department
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={departments.length === 0}
            >
              <option value="">Select Department</option>
              {departments.map((item) => (
                <option key={item.departmentCode} value={item.departmentCode}>
                  {item.departmentCode} - {item.departmentName}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="helper-text">{departmentStatus}</p>
        <button className="primary-button" onClick={addEmployee}>
          Add Employee
        </button>
      </main>
    </div>
  );
}
