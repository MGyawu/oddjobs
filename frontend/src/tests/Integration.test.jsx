import { render, screen, act, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useContext } from 'react'
import App from '../App'
import { UserContext, JobsContext, SingleJobContext } from '../App'
import { POSTEDJOBS } from './testdata'


async function renderWithRoute(route) {
    window.history.pushState({}, 'Test page', route)
    await act(async () => {
        render(<App />)
    })
}

afterEach(() => {
    sessionStorage.clear()
    cleanup()
})

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
    //console.log(location.pathname)

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

test('Calls API for Job List on the Job page and renders those jobs in /jobs page', async() =>{
    globalThis.fetch = jest.fn((url) =>{
        if (url === "/api/jobs") {
            return Promise.resolve({ ok: true, json: () => Promise.resolve({ jobs: POSTEDJOBS }) })
        }
    }) 

    await renderWithRoute("/jobs")

    const buttons = await screen.findAllByRole('button', { name: /Job Poster:/i })
    expect(buttons).toHaveLength(POSTEDJOBS.length)

    POSTEDJOBS.forEach((job, index) => {
        expect(buttons[index]).toHaveTextContent(job.username)
        expect(buttons[index]).toHaveTextContent(job.address)
        expect(buttons[index]).toHaveTextContent(job.description)
        expect(buttons[index]).toHaveTextContent(job.status)
    })
})

test('Creates a jobs for the current logged in user with correct API calls', async() => {
    const createdJob = { jobid: 3000, username: "TestUser", address: "99 Test Ave", description: "fix the roof", fixerName: "placeholder", status: "open" }

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
        if (url === "/api/jobs" && options?.method === "POST") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: "Job created", jobid: 3000 }),
            })
        }
        if (url === "/api/jobs") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ jobs: [createdJob] }),
            })
        }
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    })

    // Sign up a user
    await renderWithRoute('/')

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

    const signUpButton = screen.getByText(/Sign Up/i)
    await userEvent.click(signUpButton)

    // Navigate to Create Job page
    const createButton = await screen.findByText(/Create a Job/i)
    await userEvent.click(createButton)

    // Fill in the job form
    const addressInput = screen.getByLabelText(/Address/i)
    const descriptionInput = screen.getByLabelText(/Description/i)
    await userEvent.type(addressInput, '99 Test Ave')
    await userEvent.type(descriptionInput, 'fix the roof')

    // Submit the job
    const createJobButton = screen.getByText("Create")
    await userEvent.click(createJobButton)

    // Verify POST was called with the right data
    expect(globalThis.fetch).toHaveBeenCalledWith("/api/jobs", expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ username: "TestUser", address: "99 Test Ave", description: "fix the roof" }),
    }))

    // Navigate to Job List and verify the created job appears
    //const jobListButton = await screen.findByText(/Job List/i)
    const jobListButton = await screen.findByRole('button', { name: /Job List/i})
    await userEvent.click(jobListButton)

    const jobButtons = await screen.findAllByRole('button', { name: /Job Poster:/i })
    expect(jobButtons).toHaveLength(1)
    expect(jobButtons[0]).toHaveTextContent("TestUser")
    expect(jobButtons[0]).toHaveTextContent("99 Test Ave")
    expect(jobButtons[0]).toHaveTextContent("fix the roof")
})

test('My Jobs button only shows the logged users jobs', async() => {
    const allJobs = [
        { jobid: 4000, username: "OtherUser", address: "1 Other St", description: "paint fence", fixerName: "placeholder", status: "open" },
        { jobid: 4001, username: "TestUser", address: "50 My Rd", description: "fix sink", fixerName: "placeholder", status: "open" },
        { jobid: 4002, username: "AnotherUser", address: "7 Somewhere Ave", description: "mow lawn", fixerName: "placeholder", status: "open" },
    ]
    const userJobs = [
        { jobid: 4001, username: "TestUser", address: "50 My Rd", description: "fix sink", fixerName: "placeholder", status: "open" },
    ]

    globalThis.fetch = jest.fn((url, options) => {
        if (url === "/api/users/login" && options?.method === "POST") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    id: "test-uuid-123",
                    user_name: "TestUser",
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
                json: () => Promise.resolve({ jobs: allJobs }),
            })
        }
        if (url === "/api/jobs/users/TestUser") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ jobs: userJobs }),
            })
        }
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    })

    // Log in
    await renderWithRoute('/login')

    let inputs = screen.getAllByRole('textbox')
    await userEvent.clear(inputs[0])
    await userEvent.type(inputs[0], 'TestUser')
    await userEvent.clear(inputs[1])
    await userEvent.type(inputs[1], 'TestPassword')

    const loginButton = screen.getByText(/Log In/i)
    await userEvent.click(loginButton)

    // Job List should show all jobs from different users
    const jobListButton = await screen.findByRole('button', { name: /Job List/i })
    await userEvent.click(jobListButton)

    let jobButtons = await screen.findAllByRole('button', { name: /Job Poster:/i })
    expect(jobButtons).toHaveLength(3)
    expect(jobButtons[0]).toHaveTextContent("OtherUser")
    expect(jobButtons[1]).toHaveTextContent("TestUser")
    expect(jobButtons[2]).toHaveTextContent("AnotherUser")

    // Click My Jobs — should only show the logged-in user's jobs
    const myJobsButton = screen.getByRole('button', { name: /My Jobs/i })
    await userEvent.click(myJobsButton)

    jobButtons = await screen.findAllByRole('button', { name: /Job Poster:/i })
    expect(jobButtons).toHaveLength(1)
    expect(jobButtons[0]).toHaveTextContent("TestUser")
    expect(jobButtons[0]).toHaveTextContent("50 My Rd")
    expect(jobButtons[0]).toHaveTextContent("fix sink")
})

test('My Jobs button shows alert when no user is logged in', async() => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

    globalThis.fetch = jest.fn((url) => {
        if (url === "/api/jobs") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ jobs: [] }),
            })
        }
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    })

    await renderWithRoute('/jobs')

    const myJobsButton = await screen.findByRole('button', { name: /My Jobs/i })
    await userEvent.click(myJobsButton)

    expect(alertMock).toHaveBeenCalledWith("You are not logged in. Log in or create an account.")
    expect(location.pathname).toBe('/jobs')

    alertMock.mockRestore()
})

test('Clicking a job on the Job List page opens the Single Job page with all job details', async() => {
    const selectedJob = { jobid: 2000, username: "John Doe", address: "42 Wallaby Way, Sydney", description: "broken door", fixerName: "placeholder", status: "open" }

    globalThis.fetch = jest.fn((url) => {
        if (url === "/api/jobs") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ jobs: POSTEDJOBS }),
            })
        }
        if (url === "/api/jobs/id/2000") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(selectedJob),
            })
        }
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    })

    await renderWithRoute('/jobs')

    const jobButtons = await screen.findAllByRole('button', { name: /Job Poster:/i })
    await userEvent.click(jobButtons[0])

    expect(location.pathname).toBe('/jobs/job/2000')

    const jobInfo = await screen.findByText(/Job Info/i)
    expect(jobInfo).toBeInTheDocument()
    expect(screen.getByText(selectedJob.username)).toBeInTheDocument()
    expect(screen.getByText(selectedJob.address)).toBeInTheDocument()
    expect(screen.getByText(selectedJob.description)).toBeInTheDocument()
    expect(screen.getByText(selectedJob.fixerName)).toBeInTheDocument()
    expect(screen.getByText(selectedJob.status)).toBeInTheDocument()
    expect(screen.getByText(String(selectedJob.jobid))).toBeInTheDocument()
})

test('User creates a job, clicks it, completes it, and status updates to Complete', async() => {
    const createdJob = { jobid: 5000, username: "TestUser", address: "10 Build St", description: "replace tiles", fixerName: "placeholder", status: "open" }

    globalThis.fetch = jest.fn((url, options) => {
        if (url === "/api/users" && options?.method === "POST") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: "User created", userid: "test-uuid-456" }),
            })
        }
        if (url === "/api/users/test-uuid-456") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    id: "test-uuid-456",
                    username: "TestUser",
                    password: "TestPassword",
                    firstName: "TestFirst",
                    lastName: "TestLast",
                    email: "test@example.com",
                }),
            })
        }
        if (url === "/api/jobs" && options?.method === "POST") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: "Job created", jobid: 5000 }),
            })
        }
        if (url === "/api/jobs") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ jobs: [createdJob] }),
            })
        }
        if (url === "/api/jobs/id/5000") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(createdJob),
            })
        }
        if (url === "/api/jobs/users/TestUser/5000" && options?.method === "PUT") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: "Job has been completed" }),
            })
        }
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    })

    // Sign up
    await renderWithRoute('/')

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

    const signUpButton = screen.getByText(/Sign Up/i)
    await userEvent.click(signUpButton)

    // Navigate to Create Job page
    const createButton = await screen.findByText(/Create a Job/i)
    await userEvent.click(createButton)

    // Fill in the job form
    const addressInput = screen.getByLabelText(/Address/i)
    const descriptionInput = screen.getByLabelText(/Description/i)
    await userEvent.type(addressInput, '10 Build St')
    await userEvent.type(descriptionInput, 'replace tiles')

    // Submit the job
    const createJobBtn = screen.getByText("Create")
    await userEvent.click(createJobBtn)

    // Navigate to Job List
    const jobListButton = await screen.findByRole('button', { name: /Job List/i })
    await userEvent.click(jobListButton)

    // Click the created job
    const jobButtons = await screen.findAllByRole('button', { name: /Job Poster:/i })
    expect(jobButtons).toHaveLength(1)
    await userEvent.click(jobButtons[0])

    // Verify on Single Job page
    expect(location.pathname).toBe('/jobs/job/5000')
    const jobInfo = await screen.findByText(/Job Info/i)
    expect(jobInfo).toBeInTheDocument()
    expect(screen.getByText("open")).toBeInTheDocument()

    // Click Complete button
    const completeButton = await screen.findByRole('button', { name: /Complete/i })
    await userEvent.click(completeButton)

    // Verify status updated to Complete
    const statusValue = screen.getByText("Complete", { selector: '.value' })
    expect(statusValue).toBeInTheDocument()
    expect(screen.queryByText("open")).not.toBeInTheDocument()
})

test('A different user can become the fixer for another users job', async() => {
    const createdJob = { jobid: 6000, username: "Creator", address: "5 Maker Ave", description: "fix gutter", fixerName: "placeholder", status: "open" }

    globalThis.fetch = jest.fn((url, options) => {
        // Creator sign up
        if (url === "/api/users" && options?.method === "POST") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: "User created", userid: "creator-uuid" }),
            })
        }
        if (url === "/api/users/creator-uuid") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    id: "creator-uuid",
                    username: "Creator",
                    password: "Pass123",
                    firstName: "Cre",
                    lastName: "Ator",
                    email: "creator@example.com",
                }),
            })
        }
        if (url === "/api/jobs" && options?.method === "POST") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: "Job created", jobid: 6000 }),
            })
        }
        if (url === "/api/jobs") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ jobs: [createdJob] }),
            })
        }
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    })

    // Creator signs up
    await renderWithRoute('/')

    let inputs = screen.getAllByRole('textbox')
    await userEvent.clear(inputs[0])
    await userEvent.type(inputs[0], 'Creator')
    await userEvent.clear(inputs[1])
    await userEvent.type(inputs[1], 'Pass123')
    await userEvent.clear(inputs[2])
    await userEvent.type(inputs[2], 'Cre')
    await userEvent.clear(inputs[3])
    await userEvent.type(inputs[3], 'Ator')
    await userEvent.clear(inputs[4])
    await userEvent.type(inputs[4], 'creator@example.com')

    const signUpButton = screen.getByText(/Sign Up/i)
    await userEvent.click(signUpButton)

    // Creator creates a job
    const createButton = await screen.findByText(/Create a Job/i)
    await userEvent.click(createButton)

    const addressInput = screen.getByLabelText(/Address/i)
    const descriptionInput = screen.getByLabelText(/Description/i)
    await userEvent.type(addressInput, '5 Maker Ave')
    await userEvent.type(descriptionInput, 'fix gutter')

    const createJobBtn = screen.getByText("Create")
    await userEvent.click(createJobBtn)

    // Now a different user (Fixer) logs in
    cleanup()
    sessionStorage.clear()

    globalThis.fetch = jest.fn((url, options) => {
        if (url === "/api/users/login" && options?.method === "POST") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    id: "fixer-uuid",
                    username: "FixerUser",
                    password: "FixPass",
                    firstName: "Fix",
                    lastName: "Er",
                    email: "fixer@example.com",
                }),
            })
        }
        if (url === "/api/jobs") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ jobs: [createdJob] }),
            })
        }
        if (url === "/api/jobs/id/6000") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(createdJob),
            })
        }
        if (url === "/api/jobs/assign/fixer/6000/FixerUser" && options?.method === "PUT") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: "The fixer for the job has been assigned." }),
            })
        }
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    })

    await renderWithRoute('/login')

    inputs = screen.getAllByRole('textbox')
    await userEvent.clear(inputs[0])
    await userEvent.type(inputs[0], 'FixerUser')
    await userEvent.clear(inputs[1])
    await userEvent.type(inputs[1], 'FixPass')

    const loginButton = screen.getByText(/Log In/i)
    await userEvent.click(loginButton)

    // Navigate to Job List
    const jobListButton = await screen.findByRole('button', { name: /Job List/i })
    await userEvent.click(jobListButton)

    // Click the job created by Creator
    const jobButtons = await screen.findAllByRole('button', { name: /Job Poster:/i })
    expect(jobButtons).toHaveLength(1)
    expect(jobButtons[0]).toHaveTextContent("Creator")
    await userEvent.click(jobButtons[0])

    // Verify on Single Job page
    expect(location.pathname).toBe('/jobs/job/6000')
    await screen.findByText(/Job Info/i)
    expect(screen.getByText("placeholder")).toBeInTheDocument()

    // Click Become fixer button
    const fixerButton = await screen.findByRole('button', { name: /Become fixer/i })
    await userEvent.click(fixerButton)

    // Verify fixer updated to FixerUser
    expect(screen.getByText("FixerUser")).toBeInTheDocument()
    expect(screen.queryByText("placeholder")).not.toBeInTheDocument()
})

