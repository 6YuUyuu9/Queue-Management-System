import React, { useEffect, useState } from 'react'
import { Colors } from '../../constant/colors'
import { queueService } from '../../services/queueService'
import { useAuth } from '../../context/useAuth'

const MyReserve = () => {
    const { user } = useAuth()
    const [queues, setQueues] = useState([])

    const fetchQueues = () => {
        queueService.getAll().then(data => {
            const active = data.filter(q =>
                q.status_id !== '2' &&
                q.status_id !== '3' &&
                q.status_id !== '4' &&
                q.user_id === String(user?.user_id)
            )
            setQueues(active)
        })
    }

    useEffect(() => {
        fetchQueues()
        window.addEventListener('focus', fetchQueues)
        return () => window.removeEventListener('focus', fetchQueues)
    }, [user])

    const isToday = (dateStr) => {
        const today = new Date()
        const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
        return dateStr?.slice(0, 10) === localDate
    }

    return (
        <div className='pt-3' style={{ background: Colors.lightGray, minHeight: '300px', padding: '0 18%' }}>
            <table className="table table-borderless bg-transparent mt-3" style={{ borderRadius: '5px', overflow: 'hidden' }}>
                <thead>
                    <tr>
                        <th className="fw-bold" style={{ backgroundColor: Colors.blue, color: 'white' }}>รหัสคิว</th>
                        <th className="fw-bold" style={{ backgroundColor: Colors.blue, color: 'white' }}>ชื่อผู้จอง</th>
                        <th className="fw-bold" style={{ backgroundColor: Colors.blue, color: 'white' }}>วันที่จอง</th>
                        <th className="fw-bold" style={{ backgroundColor: Colors.blue, color: 'white' }}>เวลาจอง</th>
                        <th className="fw-bold" style={{ backgroundColor: Colors.blue, color: 'white' }}>จำนวนที่นั่ง</th>
                        <th className="fw-bold" style={{ backgroundColor: Colors.blue, color: 'white' }}>โต๊ะ</th>
                        <th style={{ backgroundColor: Colors.blue }}></th>
                    </tr>
                </thead>
                <tbody>
                    {queues.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center text-muted">ไม่มีข้อมูลคิว</td>
                        </tr>
                    ) : queues.map(q => (
                        <tr key={q.queue_id} style={{ backgroundColor: 'transparent' }}>
                            <td>{q.queue_name}</td>
                            <td>{q.username}</td>
                            <td>{q.reserve_date?.slice(0, 10)}</td>
                            <td>{q.reserve_date?.slice(11, 16)}</td>
                            <td>{q.person_count}</td>
                            <td>{q.table_name}</td>
                            <td>
                                {!isToday(q.reserve_date) && (
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-sm"
                                            style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
                                            data-bs-toggle="dropdown">
                                            ⋮
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <button
                                                    className="dropdown-item text-danger"
                                                    onClick={async () => {
                                                        await queueService.updateStatus(q.queue_id, 4)
                                                        setQueues(prev => prev.filter(item => item.queue_id !== q.queue_id))
                                                    }}>
                                                    ยกเลิก
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default MyReserve