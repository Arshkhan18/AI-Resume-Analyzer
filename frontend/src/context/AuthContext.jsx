import { createContext, useState, useEffect } from 'react'
import api from '../utils/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch {
                logout()
            }
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password })
        const tk = res.data.token
        localStorage.setItem('token', tk)
        setToken(tk)

        const payload = JSON.parse(atob(tk.split('.')[1]))
        const userData = { id: payload.id, email }
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        return res.data
    }

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password })
        return res.data
    }

    const googleLogin = async (credential) => {
        const res = await api.post('/auth/google', { token: credential })
        const tk = res.data.token
        localStorage.setItem('token', tk)
        setToken(tk)

        // Decode the Google credential to get real user info (email, name)
        const googlePayload = JSON.parse(atob(credential.split('.')[1]))
        const jwtPayload = JSON.parse(atob(tk.split('.')[1]))
        const userData = { id: jwtPayload.id, email: googlePayload.email, name: googlePayload.name }
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        return res.data
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
