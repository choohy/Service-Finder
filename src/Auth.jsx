import React, { useEffect, useState } from 'react'
import {
  signInWithGoogle,
  sendSignInLink,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOutUser,
  auth
} from './firebase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = auth.onAuthStateChanged(u => {
      setUser(u)
    })

    // If the URL contains an email sign-in link, try to complete sign-in
    if (isSignInWithEmailLink(window.location.href)) {
      const storedEmail = window.localStorage.getItem('emailForSignIn')
      const emailToUse = storedEmail || window.prompt('Please provide your email for confirmation')
      if (emailToUse) {
        signInWithEmailLink(emailToUse, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn')
            setMessage('Signed in with email link')
          })
          .catch(err => setMessage('Error completing sign-in: ' + err.message))
      }
    }

    return () => unsubscribe()
  }, [])

  const handleGoogle = async () => {
    try {
      await signInWithGoogle()
      setMessage('Signed in with Google')
    } catch (err) {
      setMessage('Google sign-in error: ' + err.message)
    }
  }

  const handleSendLink = async e => {
    e.preventDefault()
    try {
      await sendSignInLink(email)
      window.localStorage.setItem('emailForSignIn', email)
      setMessage('Email link sent — check your inbox')
    } catch (err) {
      setMessage('Error sending email link: ' + err.message)
    }
  }

  const handleSignOut = async () => {
    await signOutUser()
    setMessage('Signed out')
  }

  return (
    <div className="auth">
      {user ? (
        <div>
          <p>Signed in as: {user.email || user.displayName}</p>
          <button onClick={handleSignOut}>Sign out</button>
        </div>
      ) : (
        <div>
          <button onClick={handleGoogle}>Sign in with Google</button>

          <hr />

          <form onSubmit={handleSendLink}>
            <label>
              Email (passwordless):
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>
            <button type="submit">Send Sign-in Link</button>
          </form>
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  )
}
