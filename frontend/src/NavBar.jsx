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
            const data = await response.json()
            if (!response.ok){
                alert(data.message)
                return
            }
            setJobs(data.jobs)

        } catch (error) {
            console.log("Error receiving jobs. Try again.")
            alert("Error receiving jobs. Try again.")
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
            const data = await response.json()
            if (!response.ok){
                alert(data.message)
                return
            }
            
            setJobs(data.jobs)
        } catch (error) {
            console.log("Error receiving jobs. Try again.")
            alert("Error receiving jobs. Try again.")
        }
        navigate(`/jobs/user/${user.username}`)
    }

    const GetFixerJobList = async () =>{
         if (!user.username){ 
            alert("You are not logged in. Log in or create an account.")
            return
        }
        try{
            const response = await fetch(`/api/jobs/fixer/${user.username}`)
            const data = await response.json()
            if (!response.ok){
                alert(data.message)
                return
            }
            
            setJobs(data.jobs)
        } catch (error) {
            console.log("Error receiving jobs. Try again.")
            alert("Error receiving jobs. Try again.")
        }
        navigate(`/jobs/fixer/${user.username}`)
    }

    return(
    <div>
        <h1> Odd Jobs</h1>
        <nav>
            <button onClick={() => {navigate('/create')}}>Create a Job</button>
            <button onClick={() => GetJobList()}>Job List</button>
            <button onClick={() => GetUserJobList()}>My Jobs</button>
            <button onClick={() => GetFixerJobList()}>My Work</button>
        </nav>
    </div>
        
    )
}
export default NavBar