import React, { useEffect, useState } from 'react'
import { Colors } from '../../constant/colors'
import { queueService } from '../../services/queueService'
import { useAuth } from '../../context/useAuth'

const MyReserve = () => {
    const { user } = useAuth()
    const [queues, setQueues] = useState([])

    useEffect(() => {
        queueService.getAll().then(data => {
            const active = data.filter(q => q.status_id !== '3' && q.user_id === String(user?.user_id))
            setQueues(active)
        })
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
        <div className=' pt-3' style={{ background: Colors.lightGray, minHeight: '300px', padding: '0 18%' }}>
            <table className="table table-bordered bg-white mt-3" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <thead style={{ backgroundColor: Colors.yellow, color: Colors.blue }}>
                    <tr>
                        <th>รหัสคิว</th>
                        <th>ชื่อผู้จอง</th>
                        <th>วันที่</th>
                        <th>เวลา</th>
                        <th>จำนวนที่นั่ง</th>
                        <th>คิวก่อนหน้า</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {queues.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center text-muted">ไม่มีข้อมูลคิว</td>
                        </tr>
                    ) : queues.map(q => {
                        const reserveDate = q.reserve_date?.slice(0, 10)
                        const reserveTime = q.reserve_date?.slice(11, 16)
                        const today = isToday(q.reserve_date)

                        return (
                            <tr key={q.queue_id}>
                                <td>{q.queue_id}</td>
                                <td>{q.username}</td>
                                <td>{reserveDate}</td>
                                <td>{reserveTime}</td>
                                <td>{q.person_count}</td>
                                <td>{today ? countQueueBefore(q) : '-'}</td>
                                <td>
                                    {!today && (
                                        <button
                                            style={{ backgroundColor: 'tomato', color: 'white', border: 'none', borderRadius: '8px', padding: '4px 12px' }}
                                            onClick={() => queueService.updateStatus(q.queue_id, 2)}>
                                            ยกเลิก
                                        </button>
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