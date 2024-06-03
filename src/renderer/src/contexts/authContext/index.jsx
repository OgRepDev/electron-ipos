import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doSignInWithEmailAndPassword, doSignOut } from '../../../../firebase/auth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [role, setRole] = useState(null)
  const navigate = useNavigate()

  const logIn = async (email, password) => {
    try {
      const { user, role } = await doSignInWithEmailAndPassword(email, password)
      console.log('Role:', role) // Log role here
      setUserLoggedIn(true)
      setRole(role)
      navigate('/home')
    } catch (error) {
      console.error(error)
      // Handle login error
    }
  }

  const logOut = async () => {
    await doSignOut()
    setUserLoggedIn(false)
    setRole(null)
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ userLoggedIn, setUserLoggedIn, role, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
