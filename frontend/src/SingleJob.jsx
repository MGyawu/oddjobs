import { useContext } from "react"
import { SingleJobContext } from "./App"

const Job = () => {//{singleJob, setSingleJob}) =>{

    const {singleJob, setSingleJob} = useContext(SingleJobContext)

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