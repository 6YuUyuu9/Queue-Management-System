import React, { useEffect, useState } from 'react'
import { Colors } from '../../constant/colors'
import { queueService } from '../../services/queueService'
import { useAuth } from '../../context/useAuth'

const MyReserve = () => {
    const { user } = useAuth()
    const [queues, setQueues] = useState([])

    const fetchQueues = () => {
        queueService.getAll().then(data => {
            console.log('all data:', data)
            console.log('user_id:', user?.user_id)
            const active = data.filter(q =>
                q.status_id !== '3' &&
                q.status_id !== '4' &&
                q.user_id === String(user?.user_id)
            )
            console.log('filtered:', active)
            setQueues(active)
        })
    }

    useEffect(() => {
        fetchQueues()
        window.addEventListener('focus', fetchQueues)
        return () => window.removeEventListener('focus', fetchQueues)
    }, [user])

    const isToday = (dateStr) => {
        const today = new Date().toISOString().slice(0, 10)
        return dateStr?.slice(0, 10) === today
    }

    const countQueueBefore = (queue) => {
        return queues.filter(q =>
            q.status_id === '1' &&
            q.queue_id < queue.queue_id &&
            isToday(q.reserve_date)
        ).length
    }

    return (
        <div className='pt-3' style={{ background: Colors.lightGray, minHeight: '300px', padding: '0 18%' }}>
            <table className="table table-borderless bg-transparent mt-3" style={{ borderRadius: '5px', overflow: 'hidden' }}>
                <thead>
                    <tr>
                        <th className="fw-bold" style={{ backgroundColor: Colors.blue, color: 'white' }}>รหัสคิว</th>
                        <th className="fw-bold" style={{ backgroundColor: Colors.blue, color: 'white' }}>ชื่อผู้จอง</th>
                        <th className="fw-bold" style={{ backgroundColor: Colors.blue, color: 'white' }}>วันที่จอง</th>
                        <th className="fw-bold" style={{ backgroundColor: Colors.blue, color: 'white' }}>เวลา</th>
                        <th className="fw-bold" style={{ backgroundColor: Colors.blue, color: 'white' }}>จำนวนที่นั่ง</th>
                        <th className="fw-bold" style={{ backgroundColor: Colors.blue, color: 'white' }}>โต๊ะ</th>
                        <th className="fw-bold" style={{ backgroundColor: Colors.blue, color: 'white' }}>คิวก่อนหน้า</th>
                        <th style={{ backgroundColor: Colors.blue }}></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {queues.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="text-center text-muted">ไม่มีข้อมูลคิว</td>
                        </tr>
                    ) : queues.map(q => {
                        const reserveDate = q.reserve_date?.slice(0, 10)
                        const reserveTime = q.reserve_date?.slice(11, 16)
                        const today = isToday(q.reserve_date)

                        return (
                            <tr key={q.queue_id} style={{ backgroundColor: 'transparent' }}>
                                <td>{q.queue_name}</td>
                                <td>{q.username}</td>
                                <td>{reserveDate}</td>
                                <td>{reserveTime}</td>
                                <td>{q.person_count}</td>
                                <td>{q.table_name}</td>
                                <td>{today ? countQueueBefore(q) : '-'}</td>
                                <td style={{ position: 'relative' }}>
                                    {!today && (
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
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default MyReserve