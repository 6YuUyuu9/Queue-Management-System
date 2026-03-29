import { Navigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"

function AdminRoute({ children }) {
    const { user } = useAuth()
    if (!user) return <Navigate to="/signin" replace />
    if (user.role !== 'admin') return <Navigate to="/" replace />
    return children
}

export default AdminRoute
