import { useContext } from "react"
import { UserContext } from "./App"

const CreateJob = ()=>{

    const {user, setUser} = useContext(UserContext)

    return <div>
        <h2>Create Job</h2>
        <h3>Username: {user.username}</h3>
        <form className="create-form">
            <label>Address: <input type="text"></input></label>
            <label>Description: <textarea></textarea></label>
        </form>
        <button>Create</button>
    </div>
}

export default CreateJob