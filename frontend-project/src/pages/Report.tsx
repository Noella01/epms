import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

type PayrollReport = {
  firstName: string;
  lastName: string;
  position: string;
  departmentCode: string;
  netSalary: number;
};

export default function Report() {
  const [payroll, setPayroll] = useState<PayrollReport[]>([]);

  const getPayrollReport = async () => {
    try {
      const res = await axios.get("http://localhost:500/payroll-report", {
        withCredentials: true,
      });

      if (Array.isArray(res.data)) {
        setPayroll(res.data);
      } else {
        alert(res.data.message || "Failed to load report");
        setPayroll([]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to load report");
      } else {
        alert("Failed to load report");
      }
      console.log(error);
    }
  };

  useEffect(() => {
    getPayrollReport();
  }, []);

  return (
    <div className="page-shell">
      <Navbar />

      <main className="content-stack">
        <section className="table-card">
          <div className="section-heading with-action">
            <div>
              <span className="eyebrow">Report</span>
              <h1>Monthly Employee Payroll</h1>
              <p>Refresh the report to view the latest payroll data.</p>
            </div>
            <button className="primary-button inline-button" onClick={getPayrollReport}>
              Generate Report
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Position</th>
                  <th>Department Code</th>
                  <th>Net Salary</th>
                </tr>
              </thead>

              <tbody>
                {payroll.map((item, index) => (
                  <tr key={`${item.firstName}-${item.lastName}-${index}`}>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.position}</td>
                    <td>{item.departmentCode}</td>
                    <td>{item.netSalary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
