const singleJob = ({singleJob, setSingleJob}) =>{
    return <div>
        <h2>Job Info</h2>
        <tr><td className="element">Job Poster: </td><td className="value">{singleJob.username}</td></tr>
        <tr><td className="element">Address: </td><td className="value">{singleJob.address}</td></tr>
        <tr><td className="element">Description: </td><td className="value">{singleJob.description}</td></tr>
        <tr><td className="element">Fixer: </td><td className="value">{singleJob.fixerName}</td></tr>
        <tr><td className="element">Status: </td><td className="value">{singleJob.status}</td></tr>
    </div>
}

export default singleJob