import { useNavigate, useLocation } from "react-router-dom"
import { JobsContext, UserContext, SingleJobContext } from "./App"
import { useContext } from "react"

const NavBar = () =>{
    const navigate = useNavigate()
    const {jobs, setJobs} = useContext(JobsContext)
    const {user, setUserState} = useContext(UserContext)
    const {singleJob, setSingleJob} = useContext(SingleJobContext)

    if (location.pathname === "/" || location.pathname === "/login") return <h1>Odd Jobs</h1>

    const GetJobList = async () =>{
        try{
            const response = await fetch("/api/jobs")
            if (!response.ok) return
            const data = await response.json()
            setJobs(data.jobs)

        } catch (error) {
            console.log("Jobs not present")
        }
        
        navigate('/jobs')
    }

    const GetUserJobList = async () =>{
        if (!user.username){ 
            alert("You are not logged in. Log in or create an account.")
            return
        }
        try{
            const response = await fetch(`/api/jobs/users/${user.username}`)
            if (!response.ok) return

            const data = await response.json()
            setJobs(data.jobs)
        } catch (error) {
            console.log("Jobs not present")
        }
        navigate(`/jobs/user/${user.username}`)
    }

    return(
    <div>
        <h1> Odd Jobs</h1>
        <nav>
            {/*<button>Create a Job</button>
            <button onClick={() => navigate('/jobs')}>Job List</button>*/}
            <button onClick={() => {navigate('/create')}}>Create a Job</button>
            <button onClick={() => GetJobList()}>Job List</button>
            <button onClick={() => GetUserJobList()}>My Jobs</button>
        </nav>
    </div>
        
    )
}
export default NavBar