import { useState, useEffect } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

function App() {
  
  //Define state that stores jobs
  const [jobs, setJobs] = useState([])

  //
  useEffect(() => {
    fetchJobs()
  }, [])

  //
  const fetchJobs = async () => {
    const response = await fetch("http://127.0.0.1:5000/jobs")
    const data = await response.json()
    setJobs(DataTransfer.jobs)
    console.log(data.jobs)
  }

  return (
    <>
      
    </>
  )
}

export default App
