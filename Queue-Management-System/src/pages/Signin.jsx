import React, { useState } from 'react'
import { Colors } from '../constant/colors'
import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'

const Signin = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        const loggedInUser = await login(form.username, form.password)
        if (loggedInUser) {
            if (loggedInUser.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/')
            }
        } else {
            setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
            <div style={{ width: '100%', maxWidth: '360px', padding: '2rem', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <div className="text-center mb-4">
                    <h1 className="h3 fw-normal">เข้าสู่ระบบ</h1>
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

                {error && <p className="text-danger text-center">{error}</p>}

                <button
                    onClick={handleSubmit}
                    style={{ color: Colors.blue, backgroundColor: Colors.yellow, border: 'none' }}
                    className="btn w-100 py-2">
                    เข้าสู่ระบบ

                </button>

                <p className="mt-3 text-center text-muted" style={{ fontSize: '14px' }}>
                    ยังไม่มีบัญชี? <a href="/signup">สมัครสมาชิก</a>
                </p>
            </div>
        </div>
    )
}

export default Signin