import React from "react";

const JobList = ({jobs, setJobs}) =>{
    return <div>
        <h2>Job List</h2>
        <button>Create New Job</button>
        <table>
            <thead>
                <tr>
                    
                </tr>
            </thead>
            <tbody>
                {jobs.map((job) => (
                    <tr>
                    <button className="job" key={job.jobid}>
                        <tr><td className="element">Job Poster: </td><td className="value">{job.username}</td></tr>
                        <tr><td className="element">Address: </td><td className="value">{job.address}</td></tr>
                        <tr><td className="element">Description: </td><td className="value">{job.description}</td></tr>
                        <tr><td className="element">Fixer: </td><td className="value">{job.fixerName}</td></tr>
                        <tr><td className="element">Status: </td><td className="value">{job.status}</td></tr>
                    </button>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

}

export default JobList