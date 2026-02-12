import { useState, useEffect } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import JobList from './JobList'
import CreateJob from './CreateJob'
import SingleJob from './SingleJob'
//import testdata from './testdata.json'
function App() {
  
  //Define state that stores jobs
  //const [jobs, setJobs] = useState([])//([{"jobid": 2000, "username": "dumb", "address": "42 Wallaby Way, Sydney", "description": "broken door", "fixername": "placeholder", "status":"open"}])
  
  //const [jobs, setJobs] = useState([testdata])

  //console.log(testdata)
  //setJobs(testdata)
  
  
  const [jobs, setJobs] = useState([{"jobid": 2000, "username": "John Doe", "address": "42 Wallaby Way, Sydney", "description": "broken door", "fixername": "placeholder", "status":"open"},
  {"jobid": 2001, "username": "Jane Doe", "address": "123 Main St, Anytown", "description": "leaky faucet", "fixername": "placeholder", "status":"open"},
  {"jobid": 2002, "username": "Bob Smith", "address": "456 Elm St, Othertown", "description": "clogged drain", "fixername": "placeholder", "status":"open"},
  {"jobid": 2003, "username": "Alice Johnson", "address": "789 Oak St, Sometown", "description": "broken window", "fixername": "placeholder", "status":"open"},
  {"jobid": 2004, "username": "Charlie Brown", "address": "321 Pine St, Anycity", "description": "squeaky door", "fixername": "placeholder", "status":"open"},
  ])

  //const [singleJob, setSingleJob] = useState([])
  const [singleJob, setSingleJob] = useState({"jobid": 2001, "username": "Jane Doe", "address": "123 Main St, Anytown", "description": "leaky faucet", "fixername": "placeholder", "status":"open"})

  //Calls fetchJobs() whenever the page renders
  useEffect(() => {
    //fetchJobs()
  }, [])

  //Send request to backend to receive list of jobs
  const fetchJobs = async () => {
    const response = await fetch("http://127.0.0.1:5000/jobs")
    const data = await response.json()
    setJobs(data.jobs)
    console.log(data.jobs)
  }

  //return <JobList jobs={jobs} setJobs={setJobs}/>
  //return <CreateJob />
  return <SingleJob singleJob={singleJob} setSingleJob={setSingleJob}/>
}

export default App
