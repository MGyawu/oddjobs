import React from "react";
import { useContext, useState, useEffect } from "react";
import { JobsContext, SingleJobContext } from "./App";
import { useNavigate } from "react-router-dom";

const JobList = () =>{
    
    const {jobs,setJobs} = useContext(JobsContext)
    const {singleJob, setSingleJob} = useContext(SingleJobContext)
    const navigate = useNavigate()
    const GetSingleJob = async (jobid) =>{
        try {
            const response = await fetch(`/api/jobs/id/${jobid}`)
            if (!response.ok) {
                alert(await response.json())
                return
            }
            const data = await response.json()
            setSingleJob(data)
        } catch (error) {
            alert("Error selecting job. Please try again.")
        }
        return
    }
    
    return <div>
        <h2>Job List</h2>
            {jobs.map((job) => (
                <span key={job.jobid}>
                    <button className="jobsbutton" onClick={() =>{
                        GetSingleJob(job.jobid)
                        navigate(`/jobs/job/${job.jobid}`)
                    }}>
                        <span className="element">Job Poster: </span><span className="value">{job.username}</span>
                        <span className="element">Address: </span><span className="value">{job.address}</span>
                        <span className="element">Description: </span><span className="value">{job.description}</span>
                        <span className="element">Fixer: </span><span className="value">{job.fixerName}</span>
                        <span className="element">Status: </span><span className="value">{job.status}</span>
                    </button>
                </span>
                ))}
    </div>

}

export default JobList