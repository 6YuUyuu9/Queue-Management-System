import React from 'react'
import { Colors } from '../constant/colors'
import MyReserve from '../components/้้home/MyReserve'
import MyHistory from '../components/้้home/MyHistory'
import { useState } from 'react'
import { queueService } from '../services/queueService'
import { useEffect } from 'react'
import { useAuth } from '../context/useAuth'

const Home = () => {
  const [active, setActive] = useState('reserve')
  const [currentQueue, setCurrentQueue] = useState(null)
  const [form, setForm] = useState({
    phone: '',
    personCount: '',
    date: '',
    arriveTime: ''
  })
  const { user } = useAuth()
  const userId = user?.user_id

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async () => {
    try {
      const tableResult = await queueService.findTable(form.date, form.arriveTime, form.personCount);
      console.log('tableResult:', tableResult);  // ดูตรงนี้

      if (!tableResult.success) {
        alert(tableResult.message);
        return;
      }

      const result = await queueService.add(userId, tableResult.table.table_id, form.personCount);
      console.log('result:', result);  // ดูตรงนี้ด้วย

      if (result.success) {
        alert(`จองคิวสำเร็จ! โต๊ะ: ${tableResult.table.table_name}`);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาด:', error);
    }
  }

  useEffect(() => {
    queueService.getAll().then(data => {
      const today = new Date().toISOString().slice(0, 10)

      // หาคิวที่มี arrive_at วันนี้ เรียงล่าสุดก่อน
      const todayArrived = data
        .filter(q => q.arrive_at?.slice(0, 10) === today)
        .sort((a, b) => new Date(b.arrive_at) - new Date(a.arrive_at))

      setCurrentQueue(todayArrived[0] || null)
    })
  }, [])
  return (
    <div>
      <div style={{ padding: '0 17%' }}>
        <p className='fs-5 pt-4 text-center'>คิวปัจจุบัน</p>
        <div className="d-flex justify-content-center">
          <p
            style={{ color: Colors.blue, border: `2px solid ${Colors.yellow}`, borderRadius: '12px', padding: '0.1rem 5rem' }}
            className='fs-3 fw-bold text-center'>
            {currentQueue ? `เบอร์ ${currentQueue.queue_id}` : 'ไม่มี'}
            <p className='fs-6'>
              {currentQueue ? `คิวก่อนหน้า ${currentQueue.queue_id - 1} คิว` : ''}
            </p>
          </p>
        </div>
        <div className="d-flex flex-column gap-2 container mt-4">

          {/* บน */}
          <div className="d-flex gap-2 align-items-center">
            <label>ลงทะเบียนจองคิว</label>
            <label className='fs-4'>สวัสดีคุณ สวยใจ ใจสวย</label>
          </div>

          {/* ล่าง */}
          <div style={{ backgroundColor: Colors.lightGray, borderRadius: '16px', padding: '1.5rem' }}>
            <div className="row mb-3">
              <div className="col-6 d-flex flex-column gap-1">
                <label>Phone</label>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '6px 12px' }}>
                  <input name="phone" value={form.phone} onChange={handleChange} type="text" className="form-control border-0 bg-transparent p-0 w-100" />
                </div>
              </div>
              <div className="col-6 d-flex flex-column gap-1">
                <label>Number of People</label>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '6px 12px' }}>
                  <input name="personCount" value={form.personCount} onChange={handleChange} type="number" className="form-control border-0 bg-transparent p-0 w-100" />
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-6 d-flex flex-column gap-1">
                <label>Date</label>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '6px 12px' }}>
                  <input name="date" value={form.date} onChange={handleChange} type="date" className="form-control border-0 bg-transparent p-0 w-100" />
                </div>
              </div>
              <div className="col-6 d-flex flex-column gap-1">
                <label>Arrive time</label>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '6px 12px' }}>
                  <input name="arriveTime" value={form.arriveTime} onChange={handleChange} type="time" className="form-control border-0 bg-transparent p-0 w-100" />
                </div>
              </div>
            </div>
            <div className="mt-2 d-flex justify-content-end">
              <button
                onClick={handleRegister}
                style={{ backgroundColor: Colors.yellow, color: Colors.blue, border: 'none', borderRadius: '12px', padding: '8px 24px' }}
                className="fw-bold">
                ลงทะเบียน
              </button>
            </div>
          </div>
        </div>

        <div>
          {/* ปุ่ม navbar อยู่บน */}
          <div style={{ display: 'flex', gap: '16px', padding: '8px 12px' }}>
            <button
              onClick={() => setActive('reserve')}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                color: 'black',
                fontWeight: active === 'reserve' ? 'bold' : 'normal',
                padding: '8px 0',
                cursor: 'pointer'
              }}>
              จองคิว
            </button>
            <button
              onClick={() => setActive('history')}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                color: 'black',
                fontWeight: active === 'history' ? 'bold' : 'normal',
                padding: '8px 0',
                cursor: 'pointer'
              }}>
              ประวัติ
            </button>
          </div>
        </div>
      </div>

      <div>
        {active === 'reserve' ? <MyReserve /> : <MyHistory />}
      </div>

    </div>
  )
}

export default Home
