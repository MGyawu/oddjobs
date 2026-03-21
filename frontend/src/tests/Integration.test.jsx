import { render, screen, act, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useContext } from 'react'
import App from '../App'
import { UserContext, JobsContext, SingleJobContext } from '../App'


async function renderWithRoute(route) {
    window.history.pushState({}, 'Test page', route)
    await act(async () => {
        render(<App />)
    })
}

test('Signing up creates a user saved and returns error when sign up is done incorrectly', async() => {
    // Mock fetch to simulate successful user creation, get_user, and jobs endpoint
    
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})
    
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

    await renderWithRoute('/')

    // Fill all text boxes (clear first since CURRENTUSER pre-fills them)
    let inputs = screen.getAllByRole('textbox')
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
    const createButton = await screen.findByText(/Create a Job/i)
    await userEvent.click(createButton)

    //Locate the username on the page
    expect(screen.getByText(/TestUser/)).toBeInTheDocument()

    // Verify the mock was called and the real API was not hit
    expect(globalThis.fetch).toHaveBeenCalledTimes(3)
    //console.log(globalThis.fetch.mock.calls)

    //When info is missing from the signup
    // Switch mock to return error for missing fields
    globalThis.fetch = jest.fn((url, options) => {
        if (url === "/api/users" && options?.method === "POST") {
            return Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: "Important account info missing. Fill all fields" }),
            })
        }
        if (url === "/api/jobs") {
            return Promise.resolve({ ok: true, json: () => Promise.resolve({ jobs: [] }) })
        }
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    })

    cleanup()
    await renderWithRoute('/')

    inputs = screen.getAllByRole('textbox')
    for (const input of inputs) {
        await userEvent.clear(input)
    }

    // Get a fresh reference to the Sign Up button
    const signUpButton2 = screen.getByText(/Sign Up/i)
    await userEvent.click(signUpButton2)

    expect(alertMock).toHaveBeenCalledWith("Important account info missing. Fill all fields")
    expect(location.pathname).toBe('/')

    alertMock.mockRestore()
})

test('Login functions correctly on valid and invalid authentication attempts', async() =>{
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})
    
    globalThis.fetch = jest.fn((url, options) => {
        if (url === "/api/users/login" && options?.method === "POST") {
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

    await renderWithRoute('/login')

    let inputs = screen.getAllByRole('textbox')
    await userEvent.clear(inputs[0])
    await userEvent.type(inputs[0], 'TestUser')
    await userEvent.clear(inputs[1])
    await userEvent.type(inputs[1], 'TestPassword')

    const loginButton = screen.getByText(/Log In/i)
    await userEvent.click(loginButton)

    //Move from jobs page to Create Job page
    const createButton = await screen.findByText(/Create a Job/i)
    await userEvent.click(createButton)

    //Locate the username on the page
    expect(screen.getByText(/TestUser/)).toBeInTheDocument()

    //Invalid login checks #1 No values in textboxes
    globalThis.fetch = jest.fn((url, options) => {
        if (url === "/api/users/login" && options?.method === "POST") {
            return Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: "Username or Password not found" }),
            })
        }
        if (url === "/api/jobs") {
            return Promise.resolve({ ok: true, json: () => Promise.resolve({ jobs: [] }) })
        }
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    })

    cleanup()
    await renderWithRoute('/login')

    inputs = screen.getAllByRole('textbox')
    for (const input of inputs) {
        await userEvent.clear(input)
    }

    const loginButton2 = screen.getByText(/Log In/i)
    await userEvent.click(loginButton2)
    expect(alertMock).toHaveBeenCalledWith("Username or Password not found")

     //Invalid login checks #2 Invalid user
    globalThis.fetch = jest.fn((url, options) => {
        if (url === "/api/users/login" && options?.method === "POST") {
            return Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: "Invalid Username or Password" }),
            })
        }
        if (url === "/api/jobs") {
            return Promise.resolve({ ok: true, json: () => Promise.resolve({ jobs: [] }) })
        }
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    })

    cleanup()
    await renderWithRoute('/login')

    inputs = screen.getAllByRole('textbox')
    await userEvent.clear(inputs[0])
    await userEvent.type(inputs[0], 'InvalidUser')
    await userEvent.clear(inputs[1])
    await userEvent.type(inputs[1], 'InvalidPassword')

    const loginButton3 = screen.getByText(/Log In/i)
    await userEvent.click(loginButton3)
    expect(alertMock).toHaveBeenCalledWith("Invalid Username or Password")
})