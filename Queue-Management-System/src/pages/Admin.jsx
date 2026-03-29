import React, { useState } from 'react';
import ManageQueue from "./admin/ManageQueue";
import ManageTable from "./admin/ManageTable";

const APP_COLORS = { yellow: '#FCC402', blue: '#003666', lightGray: '#F7F7F7' };

const Admin = () => {
  const [activePage, setActivePage] = useState('queue');

  return (
    <div className="d-flex" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div className="p-4 flex-shrink-0" style={{ width: '250px', backgroundColor: APP_COLORS.lightGray }}>
        <div className="text-center mb-5">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ width: '100px', height: '100px', backgroundColor: '#FFB6C1', borderRadius: '50%', margin: '0 auto', fontSize: '1.2rem' }}
          >
            โลโก้
          </div>
        </div>

        <div className="d-flex flex-column gap-3 fs-5" style={{ cursor: 'pointer' }}>
          <div style={{ color: '#555' }}>Dashboard</div>

          <div
            className={activePage === 'queue' ? 'fw-bold text-dark' : 'text-muted'}
            onClick={() => setActivePage('queue')}
          >
            Manage queue
          </div>

          <div
            className={activePage === 'table' ? 'fw-bold text-dark' : 'text-muted'}
            onClick={() => setActivePage('table')}
          >
            Manage table
          </div>
        </div>
      </div>

      <div className="p-5 flex-grow-1 bg-white">
        {activePage === 'queue' ? <ManageQueue /> : <ManageTable />}
      </div>
    </div>
  );
};

export default Admin;