import { useContext } from "react"
import { UserContext, SingleJobContext } from "./App"
import { useNavigate } from "react-router-dom"

const CreateJob = ()=>{

    const navigate = useNavigate()
    const {user, setUserState} = useContext(UserContext)
    const {singleJob, setSingleJob} = useContext(SingleJobContext)

    const handleChange = (field, value) => {
        setSingleJob({...singleJob, [field]: value})
    }

    const SaveJob = async () => {
        try{
            const response = await fetch("/api/jobs", {
                method:"POST",
                headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: user.username,
                        address: singleJob.address,
                        description: singleJob.description
                    })
            })
            const data = await response.json()
                if (!response.ok) {
                    alert(data.message)
                    return
                }
                navigate('/jobs')
                navigate(0)
                
        }catch (error){

        }
    }

    return <div>
        <h2>Create Job</h2>
        <h3>Username: {user.username}</h3>
        <form className="create-form">
            <label>Address: <input type="text" value={singleJob.address || ""} onChange={e => handleChange("address", e.target.value)}></input></label>
            <label>Description: <textarea value={singleJob.description || ""} onChange={e => handleChange("description", e.target.value)}></textarea></label>
        </form>
        <button onClick={() => {SaveJob()}}>Create</button>
    </div>
}

export default CreateJob