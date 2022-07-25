import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'

//firebase imports
import { auth } from '../firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { updateProfile } from 'firebase/auth'

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password, displayName) => {
    setError(null) //reset error every-time we sign up a new user
    setIsPending(true) //start loading
  
    try {
      // signup
      const res = await createUserWithEmailAndPassword(auth, email, password)

      if(!res) {
        throw new Error('Could not complete sign up')
      }

      //receive the user
      const user = res.user

      // add display name to user
      await updateProfile(user, { displayName })

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })

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

  return { signup, isPending, error }
}