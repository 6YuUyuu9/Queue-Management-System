import React, { useEffect, useState } from 'react'
import { Colors } from '../../constant/colors'
import { queueService } from '../../services/queueService'
import { useAuth } from '../../context/useAuth'

const MyHistory = () => {
    const { user } = useAuth()
    const [queues, setQueues] = useState([])

    useEffect(() => {
        queueService.getAll().then(data => {
            const history = data.filter(q =>
                (q.status_id === '2' || q.status_id === '3') &&
                q.user_id === String(user?.user_id)
            )
            setQueues(history)
        })
    }, [user])

    const getStatusStyle = (statusId) => {
        if (statusId === '3') return { color: 'green', fontWeight: 'bold' }
        if (statusId === '2') return { color: 'tomato', fontWeight: 'bold' }
        return {}
    }

    return (
        <div style={{ background: Colors.lightGray, minHeight: '300px', padding: '0 18%' }}>
            <table className="table table-bordered bg-white mt-3" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <thead style={{ backgroundColor: Colors.yellow, color: Colors.blue }}>
                    <tr>
                        <th>รหัสคิว</th>
                        <th>วันที่จอง</th>
                        <th>จำนวนที่นั่ง</th>
                        <th>โต๊ะ</th>
                        <th>สถานะ</th>
                    </tr>
                </thead>
                <tbody>
                    {queues.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center text-muted">ไม่มีประวัติ</td>
                        </tr>
                    ) : queues.map(q => (
                        <tr key={q.queue_id}>
                            <td>{q.queue_id}</td>
                            <td>{q.reserve_date?.slice(0, 10)}</td>
                            <td>{q.person_count}</td>
                            <td>{q.table_name}</td>
                            <td style={getStatusStyle(q.status_id)}>{q.status_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default MyHistory