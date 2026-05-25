import React from 'react'
import { render, screen } from '@testing-library/react'
import Auth from './Auth'

test('renders sign in UI', () => {
  render(<Auth />)
  // Expect the Google sign-in button to be present
  expect(screen.getByText(/Sign in with Google/i)).toBeTruthy()
  // Expect the email input label to be present
  expect(screen.getByText(/Email \(passwordless\):/i)).toBeTruthy()
})
