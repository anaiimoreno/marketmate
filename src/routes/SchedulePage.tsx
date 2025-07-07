import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/SchedulePage.css';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const daysOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
  'Friday', 'Saturday'
];

interface Employee {
  name: string;
  shifts: string[];
}

const SchedulePage = () => {
  const [week, setWeek] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!week.trim()) return;

      try {
        const docRef = doc(db, 'schedules', week);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEmployees(data.employees || []);
        } else {
          setEmployees([]); // clear if no schedule exists
        }
      } catch (err) {
        console.error('Error fetching schedule:', err);
      }
    };

    fetchSchedule();
  }, [week]);

  const handleAddEmployee = () => {
    if (!employeeName.trim()) return;
    setEmployees(prev => [
      ...prev,
      { name: employeeName.trim(), shifts: Array(7).fill('') }
    ]);
    setEmployeeName('');
  };

  const handleRemoveEmployee = (index: number) => {
    setEmployees(prev => prev.filter((_, i) => i !== index));
  };

  const handleShiftChange = (empIndex: number, dayIndex: number, value: string) => {
    setEmployees(prev =>
      prev.map((emp, i) =>
        i === empIndex
          ? { ...emp, shifts: emp.shifts.map((shift, j) => (j === dayIndex ? value : shift)) }
          : emp
      )
    );
  };

  const handleSave = async () => {
    if (!week) {
      setMessage('Please enter a week.');
      return;
    }

    try {
      await setDoc(doc(db, 'schedules', week), {
        week,
        employees
      });
      setMessage('Schedule saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save schedule:', err);
      setMessage('Error saving schedule.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="schedule-container">
        <h2>Employee Schedule</h2>

        <div className="week-input-row">
          <label htmlFor="week-input">Enter week:</label>
          <input
            id="week-input"
            type="text"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            placeholder="e.g. June 30 - July 6"
          />
        </div>

        <div className="employee-input-row">
          <input
            type="text"
            placeholder="Employee name"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
          />
          <button type="button" onClick={handleAddEmployee}>+</button>
        </div>

        <div className="schedule-table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Name</th>
                {daysOfWeek.map(day => (
                  <th key={day}>{day}</th>
                ))}
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center' }}>No employees added yet.</td>
                </tr>
              ) : (
                employees.map((employee, empIdx) => (
                  <tr key={empIdx}>
                    <td>{employee.name}</td>
                    {daysOfWeek.map((_, dayIdx) => (
                      <td key={dayIdx}>
                        <input
                          type="text"
                          placeholder="Shift"
                          value={employee.shifts[dayIdx]}
                          onChange={(e) =>
                            handleShiftChange(empIdx, dayIdx, e.target.value)
                          }
                        />
                      </td>
                    ))}
                    <td>
                      <button className="remove-btn" onClick={() => handleRemoveEmployee(empIdx)}>Remove</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="save-button-container">
          <button className="save-btn" onClick={handleSave}>Save Schedule</button>
          {message && <p className="status-message">{message}</p>}
        </div>
      </div>
    </>
  );
};

export default SchedulePage;
