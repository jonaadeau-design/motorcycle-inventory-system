import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [motors, setMotors] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Para sa Search Bar

  // 1. LOAD MOTORS
  const fetchMotors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/motorcycles');
      setMotors(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchMotors();
  }, []);

  // 2. SAVE MOTOR
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/inventory/add', {
        brand, model, plateNumber
      });
      alert("✅ Saved Successfully!");
      setBrand(''); setModel(''); setPlateNumber('');
      fetchMotors(); 
    } catch (err) {
      alert("❌ Error: Baka duplicate ang Plate Number.");
    }
  };

  // 3. DELETE MOTOR
  const handleDelete = async (id) => {
    if (window.confirm("Sigurado ka bang buburahin ito?")) {
      try {
        await axios.delete(`http://localhost:5000/api/motorcycles/${id}`);
        fetchMotors();
      } catch (err) {
        alert("Error deleting motor.");
      }
    }
  };

  // 4. SEARCH FILTER LOGIC
  const filteredMotors = motors.filter(motor => 
    motor.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    motor.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    motor.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        
        {/* HEADER SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #f0f2f5', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '40px' }}>🏍️</div>
                <div>
                    <h2 style={{ margin: 0, color: '#1a73e8' }}>Motorcycle System</h2>
                    <small style={{ color: '#70757a' }}>Inventory Management Dashboard</small>
                </div>
            </div>
            <a href="http://localhost:5000/logout" style={{ textDecoration: 'none', background: '#ea4335', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', transition: '0.3s' }}>Logout 🚪</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
            
            {/* LEFT SIDE: ADD FORM */}
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', height: 'fit-content' }}>
                <h4 style={{ marginTop: 0, marginBottom: '20px', color: '#3c4043' }}>➕ Add New Motor</h4>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} required style={inputStyle} />
                    <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} required style={inputStyle} />
                    <input type="text" placeholder="Plate Number" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} required style={inputStyle} />
                    <button type="submit" style={btnSaveStyle}>Save Motorcycle</button>
                </form>
            </div>

            {/* RIGHT SIDE: TABLE & SEARCH */}
            <div>
                <div style={{ marginBottom: '20px' }}>
                    <input 
                        type="text" 
                        placeholder="🔍 Search Plate Number or Brand..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #dfe1e5', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#1a73e8', color: 'white' }}>
                                <th style={thStyle}>Brand</th>
                                <th style={thStyle}>Model</th>
                                <th style={thStyle}>Plate Number</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMotors.length > 0 ? (
                                filteredMotors.map((motor) => (
                                    <tr key={motor._id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                                        <td style={tdStyle}>{motor.brand}</td>
                                        <td style={tdStyle}>{motor.model}</td>
                                        <td style={tdStyle}><strong>{motor.plateNumber}</strong></td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            <button onClick={() => handleDelete(motor._id)} style={btnDelStyle}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#9aa0a6' }}>No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// STYLES (Para malinis ang code)
const inputStyle = { padding: '12px', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '14px', outline: 'none' };
const btnSaveStyle = { cursor: 'pointer', background: '#1e8e3e', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' };
const thStyle = { padding: '15px', textAlign: 'left', fontSize: '14px' };
const tdStyle = { padding: '15px', color: '#3c4043', fontSize: '14px' };
const btnDelStyle = { background: '#f8d7da', color: '#721c24', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' };

export default App;