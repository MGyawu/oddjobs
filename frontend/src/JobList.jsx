import React from "react";

const JobList = ({jobs}) =>{
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
                    <tr key={job.jobid}>
                        <td>{job.username}</td>
                        <td>{job.address}</td>
                        <td>{job.description}</td>
                        <td>{job.fixerName}</td>
                        <td>{job.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

}

export default JobList