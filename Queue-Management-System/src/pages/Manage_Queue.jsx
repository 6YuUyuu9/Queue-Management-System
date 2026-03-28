import React, { useState } from 'react'

const APP_COLORS = { yellow: '#FCC402', blue : '#003666', lightGray: '#F7F7F7' };

const Manage_Queue = () => {
  const [queues, setQueues] = useState([
    { id: 1, q_number: 'Q001', name: 'คุณสมชาย (จองออนไลน์)', count: 2, status: 'รอคิว' },
    { id: 2, q_number: 'Q002', name: 'คุณสมศรี (Walk-in)', count: 4, status: 'รอคิว' },
    { id: 3, q_number: 'Q003', name: 'คุณจอห์น (Walk-in)', count: 1, status: 'เสร็จสิ้น' },
  ])
  const [walkinName, setWalkinName] = useState('')
  const [walkinCount, setWalkinCount] = useState(1)

  const handleAddWalkin = (e) => {
    e.preventDefault()
    if (!walkinName.trim()) { alert("กรุณากรอกชื่อลูกค้าด้วยครับ"); return; }
    const newQueue = { id: queues.length + 1, q_number: `Q00${queues.length + 1}`, name: `${walkinName} (Walk-in)`, count: parseInt(walkinCount), status: 'รอคิว' }
    setQueues([...queues, newQueue])
    setWalkinName(''); setWalkinCount(1);
  }

  const handleCancelQueue = (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ที่จะยกเลิกคิวนี้?")) {
      setQueues(queues.map((q) => q.id === id ? { ...q, status: 'ยกเลิก' } : q))
    }
  }

  const handleCompleteQueue = (id) => {
    setQueues(queues.map((q) => q.id === id ? { ...q, status: 'เสร็จสิ้น' } : q))
  }

  return (
    <div>
      <h2 className="fw-bold mb-4" style={{ color: 'black' }}>จัดการคิว</h2>
      <div className="mb-4">
        <p className="fw-bold fs-5 mb-2">รายละเอียด</p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          <li>ลำดับคิว</li><li>ชื่อ</li><li>จำนวนที่จอง</li><li>สถานะ</li>
        </ul>
      </div>
      <hr className="mb-5" />

      <div className="mb-4 p-4 rounded" style={{ border: `1px solid ${APP_COLORS.blue}20` }}>
        <h5 className="mb-3 fw-bold" style={{ color: APP_COLORS.blue }}>➕ เพิ่มคิว(walkin)</h5>
        <form className="row g-3 align-items-end" onSubmit={handleAddWalkin}>
          <div className="col-md-5">
            <label className="form-label fw-bold">ชื่อลูกค้า</label>
            <input type="text" className="form-control" placeholder="เช่น คุณเอ" value={walkinName} onChange={(e) => setWalkinName(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold">จำนวนที่นั่ง (ท่าน)</label>
            <input type="number" className="form-control" min="1" value={walkinCount} onChange={(e) => setWalkinCount(e.target.value)} />
          </div>
          <div className="col-md-4">
            <button type="submit" className="btn fw-bold w-100" style={{ backgroundColor: APP_COLORS.blue, color: 'white' }}>บันทึกคิวใหม่</button>
          </div>
        </form>
      </div>

      <h5 className="mb-3 fw-bold">📋 ยกเลิกคิว(กรณี)</h5>
      <div className="table-responsive">
        <table className="table table-hover align-middle text-center border">
          <thead style={{ backgroundColor: APP_COLORS.blue, color: 'white' }}>
            <tr><th>ลำดับคิว</th><th>ชื่อลูกค้า</th><th>จำนวนที่จอง</th><th>สถานะ</th><th>จัดการ</th></tr>
          </thead>
          <tbody>
            {queues.map((q) => (
              <tr key={q.id}>
                <td className="fw-bold fs-5" style={{ color: APP_COLORS.blue }}>{q.q_number}</td>
                <td className="text-start">{q.name}</td>
                <td>{q.count} ท่าน</td>
                <td>
                  <span className="badge rounded-pill px-3 py-2" 
                        style={q.status === 'รอคิว' ? { backgroundColor: APP_COLORS.yellow, color: 'black' } : q.status === 'เสร็จสิ้น' ? {backgroundColor: '#28a745'} : {backgroundColor: '#dc3545'} }>
                    {q.status}
                  </span>
                </td>
                <td>
                  {q.status === 'รอคิว' ? (
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn btn-sm btn-outline-success" onClick={() => handleCompleteQueue(q.id)}>✔️ เรียก</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancelQueue(q.id)}>❌ ยกเลิก</button>
                    </div>
                  ) : ( <span className="text-muted">-</span> )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Manage_Queue