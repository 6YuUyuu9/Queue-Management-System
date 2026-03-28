import React, { useState, useEffect } from 'react'
import { queueService } from '../services/queueService' 

const APP_COLORS = { yellow: '#FCC402', blue : '#003666', lightGray: '#F7F7F7' };

const Manage_Queue = () => {
  const [queues, setQueues] = useState([]) 
  const [walkinCount, setWalkinCount] = useState(1) // เหลือแค่จำนวนคน

  useEffect(() => {
    fetchQueues();
  }, [])

  const fetchQueues = async () => {
    try {
      const data = await queueService.getAll();
      setQueues(data); 
    } catch (error) {
      console.error("โหลดข้อมูลคิวไม่สำเร็จ", error);
    }
  }

  const handleAddWalkin = async (e) => {
    e.preventDefault()
    
    try {
      const ADMIN_ID = 1; // ใช้ ID พนักงานเป็นคนกดจองให้
      const DEFAULT_TABLE_ID = 1; // ใส่ 1 ไปก่อน (ตาม API น้อง)

      // ส่งแค่ Admin ID, โต๊ะ, และ จำนวนคน (กระทบ backend 0%)
      await queueService.add(ADMIN_ID, DEFAULT_TABLE_ID, parseInt(walkinCount)); 
      
      alert("ออกหมายเลขคิวเรียบร้อย!");
      fetchQueues(); 
      setWalkinCount(1); // รีเซ็ตจำนวนคนกลับเป็น 1
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการบันทึกคิว (ลองเช็คว่าเปิด API PHP ไว้หรือยัง)");
    }
  }

  const handleCancelQueue = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ที่จะยกเลิกคิวนี้?")) {
      try {
        await queueService.delete(id); 
        fetchQueues(); 
      } catch (error) {
        alert("ยกเลิกคิวไม่สำเร็จ");
      }
    }
  }

  const handleCompleteQueue = async (id) => {
    try {
      await queueService.complete(id); 
      fetchQueues(); 
    } catch (error) {
      alert("อัปเดตสถานะไม่สำเร็จ");
    }
  }

  // ✨ ฟังก์ชันแต่งตัวเลข: แปลง ID คิวธรรมดา (เช่น 1) ให้กลายเป็นเลขสวยๆ (เช่น Q001)
  const formatQueueNumber = (id) => {
     if (!id) return '-';
     return `Q${String(id).padStart(3, '0')}`;
  }

  return (
    <div>
      <h2 className="fw-bold mb-4" style={{ color: 'black' }}>จัดการคิว</h2>
      <hr className="mb-5" />

      {/* ฟอร์มเปิดคิวแบบชิวๆ (ถามแค่จำนวนคน) */}
      <div className="mb-4 p-4 rounded" style={{ border: `1px solid ${APP_COLORS.blue}20` }}>
        <h5 className="mb-3 fw-bold" style={{ color: APP_COLORS.blue }}>➕ เปิดคิวใหม่ (Walk-in)</h5>
        <form className="row g-3 align-items-end" onSubmit={handleAddWalkin}>
          <div className="col-md-4">
            <label className="form-label fw-bold">จำนวนลูกค้า (ท่าน)</label>
            <input type="number" className="form-control" min="1" value={walkinCount} onChange={(e) => setWalkinCount(e.target.value)} />
          </div>
          <div className="col-md-4">
            <button type="submit" className="btn fw-bold w-100" style={{ backgroundColor: APP_COLORS.blue, color: 'white' }}>
               ออกบัตรคิว
            </button>
          </div>
        </form>
      </div>

      {/* ตารางคิว */}
      <h5 className="mb-3 fw-bold">📋 รายการคิวปัจจุบัน</h5>
      <div className="table-responsive">
        <table className="table table-hover align-middle text-center border">
          <thead style={{ backgroundColor: APP_COLORS.blue, color: 'white' }}>
            <tr><th>หมายเลขคิว</th><th>ประเภทลูกค้า</th><th>จำนวน (คน)</th><th>สถานะ</th><th>จัดการ</th></tr>
          </thead>
          <tbody>
            {queues.length === 0 ? (
              <tr><td colSpan="5" className="py-4 text-muted">กำลังโหลดข้อมูล หรือ ยังไม่มีคิว...</td></tr>
            ) : (
              queues.map((q) => (
                <tr key={q.id || q.queue_id}>
                  {/* เรียกใช้ฟังก์ชันแปลงตัวเลขให้เป็น Q00X */}
                  <td className="fw-bold fs-5" style={{ color: APP_COLORS.blue }}>
                    {formatQueueNumber(q.id || q.queue_id)}
                  </td>
                  <td className="text-start">
                     {/* ถ้า API ส่งชื่อมาก็โชว์ (เผื่อจองจากแอป) ถ้าไม่ส่งมาให้ถือว่าเป็น Walk-in */}
                     {q.name || q.user_name ? (q.name || q.user_name) : 'ลูกค้า Walk-in หน้าร้าน'}
                  </td>
                  <td>{q.count || q.person_count} ท่าน</td>
                  <td>
                    <span className="badge rounded-pill px-3 py-2 bg-warning text-dark">
                      {q.status || q.status_id || 'รอคิว'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button type="button" className="btn btn-sm btn-outline-success" onClick={() => handleCompleteQueue(q.id || q.queue_id)}>✔️ เรียกโต๊ะ</button>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleCancelQueue(q.id || q.queue_id)}>❌ ยกเลิก</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Manage_Queue