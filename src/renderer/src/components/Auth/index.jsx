import React, { useState } from 'react'
import { IoMdHelpCircle } from 'react-icons/io'
import { Navigate } from 'react-router-dom'
import { doCreateUserWithEmailAndPassword } from '../../../../firebase/auth'
import IPosLogo from '../../assets/logotyp.svg'
import { useAuth } from '../../contexts/authContext'

export const Login = () => {
  const { userLoggedIn, logIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!isSigningIn) {
      setIsSigningIn(true)
      setErrorMsg('') // Reset error message
      try {
        await logIn(email, password) // Using logIn function to sign in
        setIsSigningIn(false) // Reset isSigningIn flag after successful login
      } catch (error) {
        setErrorMsg(`Login failed: ${error.message}`) // Set error message if login fails
        setIsSigningIn(false) // Reset isSigningIn flag after failed login attempt
      }
    }
  }

  const onRegister = async (e) => {
    e.preventDefault()
    if (!isSigningIn) {
      setIsSigningIn(true)
      setErrorMsg('') // Resetowanie wiadomości o błędzie
      try {
        const { user } = await doCreateUserWithEmailAndPassword(email, password)
        setIsSigningIn(false) // Reset isSigningIn flag after successful registration
      } catch (error) {
        setErrorMsg(`Registration failed: ${error.message}`) // Ustawienie wiadomości o błędzie
        setIsSigningIn(false) // Resetowanie isSigningIn po nieudanej próbie logowania
      }
    }
  }

  return (
    <div className="w-full h-full">
      {userLoggedIn && <Navigate to={'/home'} replace={true} />}
      <div className="w-full h-full bg-white flex justify-center items-center">
        <div className="shadow-lg flex rounded-lg flex-col bg-white gap-4 p-4 justify-center items-center w-[400px] h-[550px]">
          <div>
            <img src={IPosLogo} width={150} alt="IPos logo" />
          </div>
          <div>
            <p className="opacity-80 text-center">
              <span className="text-[#4a7ba8] font-semibold text-lg">Witaj użytkowniku!</span>
              <br /> Zaloguj się aby przejść dalej
            </p>
          </div>
          <div className="w-full bg-gray-100 h-0.5 rounded-full" />
          <form className="flex flex-col gap-4 w-full" onSubmit={onSubmit}>
            <input
              placeholder="Email"
              className="bg-gray-200 w-full px-5 py-2 rounded-md shadow-md focus:outline-none"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              className="bg-gray-200 w-full px-5 py-2 rounded-md shadow-md focus:outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            <p className="opacity-50 mb-4 flex text-sm items-center gap-2 cursor-pointer">
              <IoMdHelpCircle />
              Zapomniałeś hasła?
            </p>
            <button
              type="submit"
              disabled={isSigningIn}
              className={`rounded-md bg-[#4a7ba8] hover:bg-[#3b6287] transition-colors duration-75 text-white px-4 py-2 flex items-center justify-center ${isSigningIn ? 'opacity-50' : ''}`}
            >
              Zaloguj
            </button>
          </form>
          <div className="flex justify-between items-center gap-3 w-full">
            <div className="w-1/3 bg-gray-100 h-0.5 rounded-full" />
            <p className="flex justify-center items-center opacity-50 text-sm">Muffin. 2024</p>
            <div className="w-1/3 bg-gray-100 h-0.5 rounded-full" />
            <p id="message">Version</p>
          </div>
        </div>
      </div>
    </div>
  )
}
