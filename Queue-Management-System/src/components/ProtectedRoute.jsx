import { Navigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"

function ProtectedRoute({ children, requiredRole }) {
    const { user } = useAuth()

    if (!user) return <Navigate to="/signin" replace />

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute