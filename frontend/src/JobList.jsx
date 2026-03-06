import React from "react";
import { useContext, useState, useEffect } from "react";
import { JobsContext, SingleJobContext } from "./App";
import { useNavigate } from "react-router-dom";

//const [jobs,setJobs] = useContext(JobsContext)

const JobList = () =>{//{jobs, setJobs}) =>{
    
    const {jobs,setJobs} = useContext(JobsContext)
    const {singleJob, setSingleJob} = useContext(SingleJobContext)
    const navigate = useNavigate()
    
    return <div>
        <h2>Job List</h2>
        {/*<table>*/}
            {/*<thead>
                <tr>
                    
                </tr>
            </thead>*/}
            {/*<tbody>*/}
            {jobs.map((job) => (
                <ul key={job.jobid} className="list">
                    <li>
                        <button className="jobsbutton" onClick={() =>{
                            setSingleJob(job)
                            navigate(`/jobs/${job.jobid}`)
                        }
                        }>
                            <span className="element">Job Poster: </span><span className="value">{job.username}</span>
                            <span className="element">Address: </span><span className="value">{job.address}</span>
                            <span className="element">Description: </span><span className="value">{job.description}</span>
                            <span className="element">Fixer: </span><span className="value">{job.fixerName}</span>
                            <span className="element">Status: </span><span className="value">{job.status}</span>
                        </button>
                    </li>
                </ul>
                    
                    /*<tr>
                    <button onClick={() => {
                        setSingleJob(job)
                        navigate(`/jobs/${job.jobid}`)
                    }}className="job" key={job.jobid}>
                        <tr><td className="element">Job Poster: </td><td className="value">{job.username}</td></tr>
                        <tr><td className="element">Address: </td><td className="value">{job.address}</td></tr>
                        <tr><td className="element">Description: </td><td className="value">{job.description}</td></tr>
                        <tr><td className="element">Fixer: </td><td className="value">{job.fixerName}</td></tr>
                        <tr><td className="element">Status: </td><td className="value">{job.status}</td></tr>
                    </button>
                    </tr>*/
                ))}
            {/*</tbody>*/}
        {/*</table>*/}
    </div>

}

export default JobList