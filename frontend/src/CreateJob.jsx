import { useContext } from "react"
import { UserContext } from "./App"

const CreateJob = ()=>{

    const {user, setUser} = useContext(UserContext)

    return <div>
        <h2>Create Job</h2>
        <h3>Username: {user.username}</h3>
        <form>
            <tr><label>Address: <input type="text"></input></label></tr>
            <tr><label>Description: <textarea></textarea></label></tr>
            <tr><label>Description: <textarea></textarea></label></tr>
            <tr><label>Description: <textarea></textarea></label></tr>
            <tr><label>Description: <textarea></textarea></label></tr>
        </form>
    </div>
}

export default CreateJob