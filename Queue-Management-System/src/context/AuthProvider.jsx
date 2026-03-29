import { createContext, useState } from "react"
import { userService } from "../services/userService"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    })

    const login = async (username, password) => {
        const data = await userService.login(username, password)
        if (data.success) {
            setUser(data.user)
            localStorage.setItem('user', JSON.stringify(data.user))
            return data.user  // ✅ return user แทน true
        }
        return null  // แทน false
    }

    const register = async (username, password) => {
        const data = await userService.register(username, password)
        return data
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}