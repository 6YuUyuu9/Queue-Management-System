import React, { useState } from 'react'
import { Colors } from '../../constant/colors'
import { queueService } from '../../services/queueService'
import { useAuth } from '../../context/useAuth'

const QueueForm = () => {
    const { user } = useAuth()
    const userId = user?.user_id
    const [form, setForm] = useState({
        personCount: '',
        date: '',
        arriveTime: ''
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleRegister = async () => {
        if (!form.personCount || !form.date || !form.arriveTime) {
            alert('กรุณากรอกข้อมูลให้ครบทุกช่อง')
            return
        }

        if (form.personCount < 1 || form.personCount > 6) {
            alert('จำนวนคนต้องอยู่ระหว่าง 1-6 คน')
            return
        }

        const selectedDateTime = new Date(`${form.date}T${form.arriveTime}`)
        if (selectedDateTime < new Date()) {
            alert('ไม่สามารถจองวันและเวลาที่ผ่านมาแล้วได้')
            return
        }

        try {
            const tableResult = await queueService.findTable(form.date, form.arriveTime, form.personCount)

            if (!tableResult.success) {
                alert(tableResult.message)
                return
            }

            const result = await queueService.add(
                userId,
                tableResult.table.table_id,
                form.personCount,
                form.date,
                form.arriveTime
            )

            if (result.success) {
                alert(`จองคิวเรียบร้อย ขอบคุณที่ใช้บริการค่ะ`)
                setForm({ personCount: '', date: '', arriveTime: '' })
                localStorage.setItem('queue-updated', Date.now())
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาด:', error)
            alert('ไม่สามารถจองคิวได้ในขณะนี้')
        }
    }

    return (
        <div className="d-flex flex-column gap-2 container mt-4">
            <div className="d-flex gap-2 align-items-center">
                <label>ลงทะเบียนจองคิว</label>
                <label className='fs-4'>สวัสดีคุณ {user?.username}</label>
            </div>

            <div style={{ backgroundColor: Colors.lightGray, borderRadius: '16px', padding: '1.5rem' }}>
                <div className="row mb-3">
                    <div className="col-6 d-flex flex-column gap-1">
                        <label>วันที่</label>
                        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '6px 12px' }}>
                            <input
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                type="date"
                                min={new Date().toISOString().slice(0, 10)}
                                className="form-control border-0 bg-transparent p-0 w-100" />
                        </div>
                    </div>
                    <div className="col-6 d-flex flex-column gap-1">
                        <label>เวลาที่จะมา</label>
                        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '6px 12px' }}>
                            <input
                                name="arriveTime"
                                value={form.arriveTime}
                                onChange={handleChange}
                                type="time"
                                className="form-control border-0 bg-transparent p-0 w-100" />
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-6 d-flex flex-column gap-1">
                        <label>จำนวนคน (1-6)</label>
                        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '6px 12px' }}>
                            <input
                                name="personCount"
                                value={form.personCount}
                                onChange={handleChange}
                                type="number"
                                min="1"
                                max="6"
                                className="form-control border-0 bg-transparent p-0 w-100" />
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
    )
}

export default QueueForm