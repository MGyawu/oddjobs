//import { useState, useEffect } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import JobList from './JobList'
import CreateJob from './CreateJob'
import SignUp from './SignUp'
import NavBar from './NavBar'
import LogIn from './LogIn'
import SignBar from './SignBar'
import Job from './SingleJob'
import SingleJobBar from './SingleJobBar'
//import testdata from './testdata.json'

//Router Creation
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom'

//Context Creation
import { createContext,useState, useEffect, useContext } from 'react'

//testing
import { CURRENTUSER, POSTEDJOBS } from './tests/testdata'

export const UserContext = createContext()
export const JobsContext = createContext()
export const SingleJobContext = createContext()

function App( initialJobs = POSTEDJOBS, initialUser = CURRENTUSER) {
  
  //Define state that stores jobs
 
  //Context Creation Test User
  const [user, _setUserState] = useState(() => {
    const saved = sessionStorage.getItem("user")
    return saved ? JSON.parse(saved) : {}
  })

  const setUserState = (value) => {
    _setUserState(prev => {
      const next = typeof value === 'function' ? value(prev) : value
      sessionStorage.setItem("user", JSON.stringify(next))
      return next
    })
  }
  
  const [jobs, setJobs] = useState([])
 
  const [singleJob, setSingleJob] = useState({})

  

  //Calls fetchJobs() whenever the page renders
  useEffect(() => {
    //fetchJobs()
    //console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
    const fetchedJobs = async () => {
      try{
        const response = await fetch("/api/jobs")
        if (!response.ok) return

        const data = await response.json()
        setJobs(data.jobs)
      } catch (error) {
        console.log("Jobs not present")
      }
    }

    fetchedJobs()
  }, [])

  //Router Creation
  return (
    <span>
      {/*<NavBar />*/}
      <UserContext.Provider value={{user, setUserState}}>
        <JobsContext.Provider value={{jobs, setJobs}}>
          <SingleJobContext.Provider value = {{singleJob, setSingleJob}}>
            <BrowserRouter>
              <NavBar />
              <Routes>
                <Route path='/' element={<SignUp />}/>
                <Route path='login' element={<LogIn />}/>
                <Route path='/create' element={<CreateJob />}/>
                <Route path='/jobs' element={<JobList />}/>
                <Route path='/jobs/user/:username' element={<JobList />}/>
                <Route path='/jobs/fixer/:username' element={<JobList />}/>
                <Route path='/jobs/job/:jobid' element={<Job />} />
              </Routes>
              <SignBar />
              <SingleJobBar />
            </BrowserRouter>
          </SingleJobContext.Provider>
        </JobsContext.Provider>
      </UserContext.Provider>
    </span>
  )
}

export default App
