import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useContext } from 'react'
import App from '../App'
import { UserContext, JobsContext, SingleJobContext } from '../App'


function renderWithRoute(route) {
    window.history.pushState({}, 'Test page', route)
    return render(<App />)
}

test('Signing up creates a user saved in the database', async() => {
    renderWithRoute('/')

    // Fill all text boxes
    const inputs = screen.getAllByRole('textbox')
    await userEvent.type(inputs[0], 'TestUser')
    await userEvent.type(inputs[1], 'TestPassword')
    await userEvent.type(inputs[2], 'TestFirst')
    await userEvent.type(inputs[3], 'TestLast')
    await userEvent.type(inputs[4], 'test@example.com')

    // Click Sign Up button
    const signUpButton = screen.getByText(/Sign Up/i)
    await userEvent.click(signUpButton)

    // Access UserContext
    //const user = useContext(UserContext);
    //expect(user.user.username).toBe('TestUser');
    
    //Move from jobs page to Create Job page
    const createButton = screen.getByText(/Create a Job/)
    await userEvent.click(signUpButton)

    //Locate the username on the page
    expect(screen.getByText(/TestUser/)).toBeInTheDocument()

})