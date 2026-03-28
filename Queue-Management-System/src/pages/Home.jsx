import React from 'react'
import { Colors } from '../constant/colors'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MyReserve from '../components/้้home/MyReserve'
import MyHistory from '../components/้้home/MyHistory'
import { useState } from 'react'

const Home = () => {
  const [active, setActive] = useState('reserve')
  return (
    <div>
      <div style={{ padding: '0 17%' }}>
        <p className='fs-5 pt-4 text-center'>คิวปัจจุบัน</p>
        <div className="d-flex justify-content-center">
          <p
            style={{ color: Colors.blue, border: `2px solid ${Colors.yellow}`, borderRadius: '12px', padding: '0.1rem 5rem' }}
            className='fs-3 fw-bold text-center'>
            A003
            <p className='fs-6'>
              คิวก่อนหน้า 1 คิว
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
          <div style={{ backgroundColor: Colors.lightGray, borderRadius: '16px', padding: '1.5rem' }} >
            <div className="row mb-3">
              <div className="col-6 d-flex align-items-center gap-2">
                <label>Phone</label>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '6px 12px', flex: 1 }}>
                  <input type="text" className="form-control border-0 bg-transparent p-0 w-100" />
                </div>
              </div>
              <div className="col-6 d-flex align-items-center gap-2">
                <label>Number of People</label>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '6px 12px', flex: 1 }}>
                  <input type="number" className="form-control border-0 bg-transparent p-0 w-100" />
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-6 d-flex align-items-center gap-2">
                <label>Date</label>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '6px 12px', flex: 1 }}>
                  <input type="date" className="form-control border-0 bg-transparent p-0 w-100" />
                </div>
              </div>
              <div className="col-6 d-flex align-items-center gap-2">
                <label>Arrive time</label>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '6px 12px', flex: 1 }}>
                  <input type="time" className="form-control border-0 bg-transparent p-0 w-100" />
                </div>
              </div>
            </div>
            <div className="mt-2 d-flex justify-content-end">
              <button style={{ backgroundColor: Colors.yellow, color: Colors.blue, border: 'none', borderRadius: '12px', padding: '8px 24px' }} className="fw-bold">
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
