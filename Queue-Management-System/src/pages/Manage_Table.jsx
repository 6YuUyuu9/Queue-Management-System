import React, { useState } from 'react';

const APP_COLORS = { yellow: '#FCC402', blue : '#003666', lightGray: '#F7F7F7' };

const Manage_Table = () => {
  const [tables, setTables] = useState([
    { id: 1, name: 'T01', type: 'นั่งคนเดียว', capacity: 1, status: 'ว่าง' },
    { id: 2, name: 'T02', type: 'T02 (คู่)', capacity: 2, status: 'จองอยู่' },
    { id: 3, name: 'T03', type: 'T03 (4 คน)', capacity: 4, status: 'เต็ม' },
    { id: 4, name: 'T04', type: 'T04 (6 คน)', capacity: 6, status: 'ว่าง' },
    { id: 5, name: 'T05', type: 'T05 (คู่)', capacity: 2, status: 'ว่าง' },
  ]);

  const availableSeats = tables.filter(t => t.status === 'ว่าง').reduce((sum, t) => sum + t.capacity, 0);
  const reservedSeats = tables.filter(t => t.status === 'จองอยู่').reduce((sum, t) => sum + t.capacity, 0);
  const occupiedSeats = tables.filter(t => t.status === 'เต็ม').reduce((sum, t) => sum + t.capacity, 0);

  return (
    <div>
      <h2 className="fw-bold mb-4" style={{ color: 'black' }}>จัดการโต๊ะ</h2>
      <hr className="mb-4" />

      <h5 className="fw-bold mb-3" style={{ color: APP_COLORS.blue }}>📊 ภาพรวมที่นั่งทั้งหมด</h5>
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="card text-center border-success shadow-sm">
            <div className="card-body">
              <h6 className="card-title text-success fw-bold">🟢 ที่นั่งว่าง (Available)</h6>
              <h2 className="display-6 fw-bold">{availableSeats}</h2>
              <small className="text-muted">ที่นั่ง</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center border-warning shadow-sm">
            <div className="card-body">
              <h6 className="card-title text-warning fw-bold">🟡 ถูกจอง (Reserved)</h6>
              <h2 className="display-6 fw-bold">{reservedSeats}</h2>
              <small className="text-muted">ที่นั่ง</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center border-danger shadow-sm">
            <div className="card-body">
              <h6 className="card-title text-danger fw-bold">🔴 ใช้งานอยู่ (Occupied)</h6>
              <h2 className="display-6 fw-bold">{occupiedSeats}</h2>
              <small className="text-muted">ที่นั่ง</small>
            </div>
          </div>
        </div>
      </div>

      <h5 className="fw-bold mb-3" style={{ color: APP_COLORS.blue }}>🪑 รายการโต๊ะตามประเภท</h5>
      <div className="table-responsive">
        <table className="table table-hover align-middle text-center border">
          <thead style={{ backgroundColor: APP_COLORS.blue, color: 'white' }}>
            <tr><th>รหัสโต๊ะ</th><th>ประเภทโต๊ะ</th><th>รองรับได้ (คน)</th><th>สถานะปัจจุบัน</th><th>จัดการ</th></tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table.id}>
                <td className="fw-bold">{table.name}</td>
                <td>{table.type}</td>
                <td>{table.capacity}</td>
                <td>
                  <span className={`badge rounded-pill px-3 py-2 ${table.status === 'ว่าง' ? 'bg-success' : table.status === 'จองอยู่' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                    {table.status}
                  </span>
                </td>
                <td><button className="btn btn-sm btn-outline-secondary">เปลี่ยนสถานะ</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Manage_Table;