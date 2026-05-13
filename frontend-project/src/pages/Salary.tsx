import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

type SalaryRecord = {
  id: number;
  grossSalary: number;
  totalDeduction: number;
  netSalary: number;
  month: string;
};

export default function Salary() {
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [grossSalary, setGrossSalary] = useState("");
  const [totalDeduction, setTotalDeduction] = useState("");
  const [month, setMonth] = useState("");

  const netSalary = Number(grossSalary) - Number(totalDeduction);

  const clearForm = () => {
    setId(null);
    setGrossSalary("");
    setTotalDeduction("");
    setMonth("");
  };

  const getSalaries = async () => {
    try {
      const res = await axios.get("http://localhost:500/salary", {
        withCredentials: true,
      });

      if (Array.isArray(res.data)) {
        setSalaries(res.data);
      } else {
        alert(res.data.message || "Failed to load salaries");
        setSalaries([]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to load salaries");
      } else {
        alert("Failed to load salaries");
      }
      console.log(error);
    }
  };

  const saveSalary = async () => {
    try {
      const payload = {
        grossSalary,
        totalDeduction,
        netSalary,
        month,
      };

      const res =
        id === null
          ? await axios.post("http://localhost:500/salary", payload, {
              withCredentials: true,
            })
          : await axios.put(`http://localhost:500/salary/${id}`, payload, {
              withCredentials: true,
            });

      alert(res.data.message);
      if (res.data.success) {
        clearForm();
        getSalaries();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to save salary");
      } else {
        alert("Failed to save salary");
      }
      console.log(error);
    }
  };

  const editSalary = (salary: SalaryRecord) => {
    setId(salary.id);
    setGrossSalary(String(salary.grossSalary));
    setTotalDeduction(String(salary.totalDeduction));
    setMonth(salary.month.slice(0, 10));
  };

  const deleteSalary = async (currentId: number) => {
    try {
      const res = await axios.delete(
        `http://localhost:500/salary/${currentId}`,
        { withCredentials: true }
      );

      alert(res.data.message);
      if (res.data.success) {
        getSalaries();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to delete salary");
      } else {
        alert("Failed to delete salary");
      }
      console.log(error);
    }
  };

  useEffect(() => {
    getSalaries();
  }, []);

  return (
    <div className="page-shell">
      <Navbar />

      <main className="content-stack">
        <section className="form-card">
          <div className="form-heading">
            <span className="eyebrow">Payroll</span>
            <h1>Payroll / Salary</h1>
            <p>Add a salary record or update an existing one.</p>
          </div>

          <div className="form-grid">
            <label>
              Gross Salary
              <input
                type="number"
                placeholder="Enter gross salary"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
              />
            </label>

            <label>
              Total Deduction
              <input
                type="number"
                placeholder="Enter deduction"
                value={totalDeduction}
                onChange={(e) => setTotalDeduction(e.target.value)}
              />
            </label>

            <label>
              Month
              <input
                type="date"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </label>

            <div className="summary-tile">
              <span>Net Salary</span>
              <strong>{netSalary}</strong>
            </div>
          </div>

          <div className="button-row">
            <button className="primary-button inline-button" onClick={saveSalary}>
              {id === null ? "Add Salary" : "Update Salary"}
            </button>
            <button className="secondary-button" onClick={clearForm}>
              Clear
            </button>
          </div>
        </section>

        <section className="table-card">
          <div className="section-heading">
            <h2>Salaries</h2>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Gross Salary</th>
                  <th>Total Deduction</th>
                  <th>Net Salary</th>
                  <th>Month</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {salaries.map((salary) => (
                  <tr key={salary.id}>
                    <td>{salary.id}</td>
                    <td>{salary.grossSalary}</td>
                    <td>{salary.totalDeduction}</td>
                    <td>{salary.netSalary}</td>
                    <td>{salary.month}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="small-button"
                          onClick={() => editSalary(salary)}
                        >
                          Edit
                        </button>
                        <button
                          className="small-button danger-button"
                          onClick={() => deleteSalary(salary.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
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
