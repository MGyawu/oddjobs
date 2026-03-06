import { createContext,useState, useEffect, useContext } from 'react'
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

  /*
  const [user, setUser] = useState(CURRENTUSER)
  const [jobs, setJobs] = useState(POSTEDJOBS)
  const [singleJob, setSingleJob] = useState({})

  return render(
    <UserContext.Provider value={{user, setUser}}>
      <JobsContext.Provider value={{jobs, setJobs}}>
        <SingleJobContext.Provider value={{singleJob, setSingleJob}}>
          <App />
        </SingleJobContext.Provider>
      </JobsContext.Provider>
    </UserContext.Provider>
  )*/

  function Wrapper({ children }) {
    const [user, setUser] = useState(CURRENTUSER);
    const [jobs, setJobs] = useState(POSTEDJOBS);
    const [singleJob, setSingleJob] = useState({});
    return (
      <UserContext.Provider value={{ user, setUser }}>
        <JobsContext.Provider value={{ jobs, setJobs }}>
          <SingleJobContext.Provider value={{ singleJob, setSingleJob }}>
            {children}
          </SingleJobContext.Provider>
        </JobsContext.Provider>
      </UserContext.Provider>
    );
  }

  return render(
    <Wrapper>
      <App />
    </Wrapper>
  );
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

test('Render Job List page', () => {
    renderWithRoute('/jobs')

    expect(screen.getByRole('heading', {name: /Job List/})).toBeInTheDocument()
    expect(screen.getByText(/Odd Jobs/)).toBeInTheDocument()
    expect(screen.getByText(/Create a Job/)).toBeInTheDocument()
    expect(screen.getByText(/My Jobs/)).toBeInTheDocument()

      POSTEDJOBS.map((job) => {
        
        const users = screen.getAllByText(RegExp(job.username))
        expect(users.length > 0)
        const addresses = screen.getAllByText(RegExp(job.address))
        expect(addresses.length > 0)
        const des = screen.getAllByText(RegExp(job.description))
        expect(des.length > 0)
        const status = screen.getAllByText(RegExp(job.status))
        expect(status.length > 0)
      })
})

test('Render Create Jobs page', () => {
    renderWithRoute('/create')

    expect(screen.getByText(/Odd Jobs/)).toBeInTheDocument()
    expect(screen.getByText(/Create a Job/)).toBeInTheDocument()
    expect(screen.getByText(/My Jobs/)).toBeInTheDocument()
    expect(screen.getByText(/Job List/)).toBeInTheDocument()
    expect(screen.getByText(/Address/)).toBeInTheDocument()
    expect(screen.getByText(/Description/)).toBeInTheDocument()
    //expect(screen.getByText(/Create/)).toBeInTheDocument()

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