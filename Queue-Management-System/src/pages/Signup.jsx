import React, { useState } from 'react'
import { Colors } from '../constant/colors'
import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', password: '', confirm: '' })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        if (form.password !== form.confirm) {
            setError('รหัสผ่านไม่ตรงกัน')
            return
        }
        const data = await register(form.username, form.password)
        if (data.success) {
            navigate('/signin')
        } else {
            setError(data.message || 'สมัครสมาชิกไม่สำเร็จ')
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
            <div style={{ width: '100%', maxWidth: '360px', padding: '2rem', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <div className="text-center mb-4">
                    <h1 className="h3 fw-normal">สมัครสมาชิก</h1>
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Username" />
                </div>

                <div className="mb-3">
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Password" />
                </div>

                <div className="mb-4">
                    <input
                        type="password"
                        name="confirm"
                        value={form.confirm}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Confirm Password" />
                </div>

                {error && <p className="text-danger text-center">{error}</p>}

                <button
                    onClick={handleSubmit}
                    style={{ color: Colors.blue, backgroundColor: Colors.yellow, border: 'none' }}
                    className="btn w-100 py-2">
                    สมัครสมาชิก
                </button>

                <p className="mt-3 text-center text-muted" style={{ fontSize: '14px' }}>
                    มีบัญชีแล้ว? <a href="/signin">เข้าสู่ระบบ</a>
                </p>
            </div>
        </div>
    )
}

export default Signup