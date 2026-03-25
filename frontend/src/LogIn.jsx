import { useState } from "react"
import { UserContext } from "./App"
import { useContext } from "react";

const LogIn = () =>{
    //return <div>Sign Up Page Placeholder</div>
    const { user, setUserState } = useContext(UserContext);
    
    const handleChange = (field, value) => {
        setUserState(prev => ({ ...prev, [field]: value }));
    }

    return (
        <div>
            <span className="jobsbutton">Username: <input type="text" value={user.username || ""} onChange={e => handleChange("username", e.target.value)} /></span>
            <span className="jobsbutton">Password: <input type="text" value={user.password || ""} onChange={e => handleChange("password", e.target.value)} /></span>
        </div>
    )
}

export default LogIn