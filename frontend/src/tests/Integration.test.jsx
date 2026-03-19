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
    // Mock fetch to simulate successful user creation, get_user, and jobs endpoint
    globalThis.fetch = jest.fn((url, options) => {
        if (url === "/api/users" && options?.method === "POST") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: "User created", userid: "test-uuid-123" }),
            })
        }
        if (url === "/api/users/test-uuid-123") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    id: "test-uuid-123",
                    username: "TestUser",
                    password: "TestPassword",
                    firstName: "TestFirst",
                    lastName: "TestLast",
                    email: "test@example.com",
                }),
            })
        }
        if (url === "/api/jobs") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ jobs: [] }),
            })
        }
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    })

    renderWithRoute('/')

    // Fill all text boxes (clear first since CURRENTUSER pre-fills them)
    const inputs = screen.getAllByRole('textbox')
    await userEvent.clear(inputs[0])
    await userEvent.type(inputs[0], 'TestUser')
    await userEvent.clear(inputs[1])
    await userEvent.type(inputs[1], 'TestPassword')
    await userEvent.clear(inputs[2])
    await userEvent.type(inputs[2], 'TestFirst')
    await userEvent.clear(inputs[3])
    await userEvent.type(inputs[3], 'TestLast')
    await userEvent.clear(inputs[4])
    await userEvent.type(inputs[4], 'test@example.com')

    // Click Sign Up button
    const signUpButton = screen.getByText(/Sign Up/i)
    await userEvent.click(signUpButton)
    console.log(location.pathname)

    // Access UserContext
    //const user = useContext(UserContext);
    //expect(user.user.username).toBe('TestUser');
    
    //Move from jobs page to Create Job page
    const createButton = screen.getByText(/Create a Job/i)
    await userEvent.click(createButton)

    //Locate the username on the page
    expect(screen.getByText(/TestUser/)).toBeInTheDocument()

    // Verify the mock was called and the real API was not hit
    expect(globalThis.fetch).toHaveBeenCalledTimes(3)
    //console.log(globalThis.fetch.mock.calls)

})

test('User creates a job and is added tp Job List', async() =>{
    
})