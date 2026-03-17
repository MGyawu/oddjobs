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
  //const [jobs, setJobs] = useState([])//([{"jobid": 2000, "username": "dumb", "address": "42 Wallaby Way, Sydney", "description": "broken door", "fixername": "placeholder", "status":"open"}])
  
  //const [jobs, setJobs] = useState([testdata])

  //console.log(testdata)
  //setJobs(testdata)
  
  //Context Creation Test User
  const [user, setUser] = useState(CURRENTUSER)
  //const [user, setUser] = useState({})
  /*
  const [user, setUser] = useState({
    "id": "4206769",
    "username" : "Doc Martin",
    "password" : "pa$$w0rd",
    "firstName" : "Doc",
    "lastName" : "Martin",
    "email" : "Doc.Martin@hotmail.org"
  })
    */

  const [jobs, setJobs] = useState(POSTEDJOBS)
  //const [jobs, setJobs] = useState([])
  /*
  const [jobs, setJobs] = useState([{"jobid": 2000, "username": "John Doe", "address": "42 Wallaby Way, Sydney", "description": "broken door", "fixername": "placeholder", "status":"open"},
  {"jobid": 2001, "username": "Jane Doe", "address": "123 Main St, Anytown", "description": "leaky faucet", "fixername": "placeholder", "status":"open"},
  {"jobid": 2002, "username": "Bob Smith", "address": "456 Elm St, Othertown", "description": "clogged drain", "fixername": "placeholder", "status":"open"},
  {"jobid": 2003, "username": "Alice Johnson", "address": "789 Oak St, Sometown", "description": "broken window", "fixername": "placeholder", "status":"open"},
  {"jobid": 2004, "username": "Charlie Brown", "address": "321 Pine St, Anycity", "description": "squeaky door", "fixername": "placeholder", "status":"open"},
  {"jobid": 2005, "username": "Jane Doe", "address": "123 Main St, Anytown", "description": "A fire truck crashed into my home", "fixername": "placeholder", "status":"open"}
  ])
  */

  //const [singleJob, setSingleJob] = useState([])
  //const [singleJob, setSingleJob] = useState({"jobid": 2001, "username": "Jane Doe", "address": "123 Main St, Anytown", "description": "leaky faucet", "fixername": "placeholder", "status":"open"})
  const [singleJob, setSingleJob] = useState({})

  
  //Send request to backend to receive list of jobs
  /*const fetchJobs = async () => {
    const response = await fetch("http://127.0.0.1:5000/jobs")
    const data = await response.json()
    setJobs(data.jobs)
    console.log(data.jobs)
  }*/

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


  //return <JobList jobs={jobs} setJobs={setJobs}/>
  //return <CreateJob />
  //return <SingleJob singleJob={singleJob} setSingleJob={setSingleJob}/>
  //return <SignUp />

  //Router Creation
  return (
    <span>
      {/*<NavBar />*/}
      <UserContext.Provider value={{user, setUser}}>
        <JobsContext.Provider value={{jobs, setJobs}}>
          <SingleJobContext.Provider value = {{singleJob, setSingleJob}}>
            <BrowserRouter>
              <NavBar />
              <Routes>
                <Route path='/' element={<SignUp />}/>
                <Route path='login' element={<LogIn />}/>
                <Route path='/create' element={<CreateJob />}/>
                {/*<Route path='/jobs' element={<JobList jobs={jobs} setJobs={setJobs}/>}/>*/}
                <Route path='/jobs' element={<JobList />}/>
                <Route path='/jobs/:jobid' element={<Job />} />
              </Routes>
              <SignBar />
            </BrowserRouter>
          </SingleJobContext.Provider>
        </JobsContext.Provider>
      </UserContext.Provider>
    </span>
  )
}

export default App
