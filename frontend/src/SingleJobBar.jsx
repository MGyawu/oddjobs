import { SingleJobContext, UserContext } from "./App"
import { useContext } from "react"

const SingleJobBar = () => {
    const {singleJob, setSingleJob} = useContext(SingleJobContext)
    const {user, setUserState} = useContext(UserContext)

    const CompleteJob = async() => {
        try {
            const response = await fetch(`/api/jobs/users/${user.username}/${singleJob.jobid}`,{
                method: "PUT"
            })
            const data = await response.json()
            if (!response.ok){
                alert(data.message)
                return
            }
            setSingleJob({...singleJob, status: "Complete"})
        } catch (error) {
            alert("Error completing job. Please try again.")
        }
    }

    const FixJob = async() => {
        try {
            const response = await fetch(`/api/jobs/assign/fixer/${singleJob.jobid}/${user.username}`,{
                method: "PUT"
            })
            const data = await response.json()
            if (!response.ok){
                alert(data.message)
                return
            }
            setSingleJob({...singleJob, fixerName: user.username})
        } catch (error) {
            alert("Error assigning fixer. Please try again")
        }
    }

    if (!user.username || !singleJob.jobid) return null

    if (user.username == singleJob.username){
        return(
            <button onClick={() => CompleteJob()}>Complete</button>
        )
    }

    if (user.username != singleJob.username){
        return(
            <button onClick={() => FixJob()}>Become fixer</button>
        )
    }

}

export default SingleJobBar