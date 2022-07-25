import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'

//firebase imports
import { auth } from '../firebase/config'
import { signOut } from 'firebase/auth'

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const logout = async (email, password) => {
    setError(null)
    setIsPending(true)
  
    try {
      // logout
      await signOut(auth, email, password)

      // dispatch login action
      dispatch({ type: 'LOGOUT' })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { logout, isPending, error }
}