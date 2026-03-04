import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
/**
 * @jest-environment jsdom
 */

test('Renders Sign up page on default route', () => {
    render(<App />)

    expect(screen.getByText(/Odd Jobs/)).toBeInTheDocument()
    expect(screen.getByText(/Sign Up/)).toBeInTheDocument()
    expect(screen.getByText(/Log In/)).toBeInTheDocument()
    expect(screen.getByText(/Username/)).toBeInTheDocument()
    expect(screen.getByText(/Password/)).toBeInTheDocument()
    expect(screen.getByText(/First Name/)).toBeInTheDocument()
    expect(screen.getByText(/Last Name/)).toBeInTheDocument()
    expect(screen.getByText(/Email/)).toBeInTheDocument()
})