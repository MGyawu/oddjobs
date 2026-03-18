import { useState } from "react"
import { useContext } from "react"
import { UserContext } from "./App"

const SignUp = () =>{
    //return <div>Sign Up Page Placeholder</div>

    const { user, setUser } = useContext(UserContext);

    const handleChange = (field, value) => {
        setUser(prev => ({ ...prev, [field]: value }));
    }

    return (
        <div>
            <span className="jobsbutton">Username: <input type="text" value={user.username || ""} onChange={e => handleChange("username", e.target.value)} /></span>
            <span className="jobsbutton">Password: <input type="text" value={user.password || ""} onChange={e => handleChange("password", e.target.value)} /></span>
            <span className="jobsbutton">First Name: <input type="text" value={user.firstName || ""} onChange={e => handleChange("firstName", e.target.value)} /></span>
            <span className="jobsbutton">Last Name: <input type="text" value={user.lastName || ""} onChange={e => handleChange("lastName", e.target.value)} /></span>
            <span className="jobsbutton">Email: <input type="text" value={user.email || ""} onChange={e => handleChange("email", e.target.value)} /></span>
        </div>
    )
}

export default SignUp