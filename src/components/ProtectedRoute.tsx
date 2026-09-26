import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'
import Spinner from './Spinner'

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth()

    if (loading) return <Spinner label="Authenticating..." />
    if (!user) return <Navigate to="/login" replace />

    return <>{children}</>
}

export default ProtectedRoute