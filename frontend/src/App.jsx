import { useState, useEffect } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import JobList from './JobList'

function App() {
  
  //Define state that stores jobs
  const [jobs, setJobs] = useState([])

  //Calls fetchJobs() whenever the page renders
  useEffect(() => {
    fetchJobs()
  }, [])

  //Send request to backend to receive list of jobs
  const fetchJobs = async () => {
    const response = await fetch("http://127.0.0.1:5000/jobs")
    const data = await response.json()
    setJobs(DataTransfer.jobs)
    console.log(data.jobs)
  }

  return <JobList jobs={jobs} />
}

export default App
