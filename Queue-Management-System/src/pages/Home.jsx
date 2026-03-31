import React, { useState, useEffect } from 'react'
import { Colors } from '../constant/colors'
import MyReserve from '../components/home/MyReserve'
import MyHistory from '../components/home/MyHistory'
import QueueForm from '../components/home/QueueForm'
import { queueService } from '../services/queueService'

const Home = () => {
  const [active, setActive] = useState('reserve')
  const [summary, setSummary] = useState({ latest_queue: '-', remaining_count: 0 })

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await queueService.getSummary()
        setSummary(data)
      } catch (err) {
        console.error('โหลด summary ไม่ได้:', err)
      }
    }
    fetchSummary()
  }, [])

  return (
    <div>
      <div style={{ padding: '0 17%' }}>
         {summary.latest_queue !== 'ไม่มีคิวรอเรียก' && (
          <>
            <p className='fs-5 pt-4 text-center'>คิวถัดไป</p>
            <div className="d-flex justify-content-center">
              <p
                style={{ color: Colors.blue, border: `2px solid ${Colors.yellow}`, borderRadius: '12px', padding: '0.1rem 5rem' }}
                className='fs-3 fw-bold text-center'>
                {summary.latest_queue}
                <p className='fs-6'>
                  คิวรอเข้า {summary.remaining_count} คิว
                </p>
              </p>
            </div>
          </>
        )}

        <QueueForm />

        <div>
          <div className='mt-4' style={{ display: 'flex', gap: '16px', padding: '8px 12px' }}>
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