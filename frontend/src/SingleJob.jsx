import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { SingleJobContext } from "./App"

const Job = () => {//{singleJob, setSingleJob}) =>{

    const {singleJob, setSingleJob} = useContext(SingleJobContext)
    const { jobid } = useParams()

    useEffect(() => {
        if (singleJob.jobid === Number(jobid) || singleJob.jobid === jobid) return

        const fetchJob = async () => {
            try {
                const response = await fetch(`/api/jobs/id/${jobid}`)
                if (!response.ok) return
                const data = await response.json()
                setSingleJob(data)
            } catch (error) {
                console.log("Job not found")
            }
        }
        fetchJob()
    }, [jobid])

    return <span>
        <h2>Job Info</h2>
        <div className="jobsbutton">
            <span className="element">Job Poster: </span><span className="value">{singleJob.username}</span>
            <span className="element">Address: </span><span className="value">{singleJob.address}</span>
            <span className="element">Description: </span><span className="value">{singleJob.description}</span>
            <span className="element">Fixer: </span><span className="value">{singleJob.fixerName}</span>
            <span className="element">Status: </span><span className="value">{singleJob.status}</span>
            <span className="element">Job ID: </span><span className="value">{singleJob.jobid}</span>
        </div>
    </span>
}

export default Job