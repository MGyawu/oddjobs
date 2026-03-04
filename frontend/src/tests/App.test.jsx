import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { UserContext, JobsContext, SingleJobContext } from '../App'
import { CURRENTUSER, POSTEDJOBS } from './testdata';
/**
 * @jest-environment jsdom
 */

function renderWithRoute(route) {
  window.history.pushState({}, 'Test page', route);
  return render(
    <UserContext.Provider value={CURRENTUSER}>
      <JobsContext.Provider value={POSTEDJOBS}>
        <SingleJobContext.Provider value={{}}>
          <App />
        </SingleJobContext.Provider>
      </JobsContext.Provider>
    </UserContext.Provider>
  )
}

test('Renders Sign up page on default route', () => {
    renderWithRoute('/')

    expect(screen.getByText(/Odd Jobs/)).toBeInTheDocument()
    expect(screen.getByText(/Sign Up/)).toBeInTheDocument()
    expect(screen.getByText(/Log In/)).toBeInTheDocument()
    expect(screen.getByText(/Username/)).toBeInTheDocument()
    expect(screen.getByText(/Password/)).toBeInTheDocument()
    expect(screen.getByText(/First Name/)).toBeInTheDocument()
    expect(screen.getByText(/Last Name/)).toBeInTheDocument()
    expect(screen.getByText(/Email/)).toBeInTheDocument()
})

test('Render Log In page', () => {
    renderWithRoute('/login')

    expect(screen.getByText(/Odd Jobs/)).toBeInTheDocument()
    expect(screen.getByText(/Sign Up/)).toBeInTheDocument()
    expect(screen.getByText(/Log In/)).toBeInTheDocument()
    expect(screen.getByText(/Username/)).toBeInTheDocument()
    expect(screen.getByText(/Password/)).toBeInTheDocument()
})

/*
test('Render Job List Page', () =>{
    renderWithRoute('/jobs');

    expect(screen.getByText(/Job List/i)).toBeInTheDocument()

    POSTEDJOBS.map((job) => (
        expect(screen.getByText(/{job.username}/)).toBeInTheDocument()
        expect(screen.getByText(/Odd Jobs/)).toBeInTheDocument()
        expect(screen.getByText(/Odd Jobs/)).toBeInTheDocument()
        expect(screen.getByText(/Odd Jobs/)).toBeInTheDocument()
        expect(screen.getByText(/Odd Jobs/)).toBeInTheDocument()
    )
    )

})
    */