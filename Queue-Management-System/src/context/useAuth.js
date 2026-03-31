import { useContext } from "react"
import { AuthContext } from "./AuthProvider"

export function useAuth() {
    const context = useContext(AuthContext)
    return context
}