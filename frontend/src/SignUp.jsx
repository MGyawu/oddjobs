import { useState } from "react";

const SignUp = () =>{
    //return <div>Sign Up Page Placeholder</div>

    return (
        <div>
                <span className="jobsbutton">Username: <input type="text"></input></span>
                <span className="jobsbutton">Password: <input type="text"></input></span>
                <span className="jobsbutton">First Name: <input type="text"></input></span>
                <span className="jobsbutton">Last Name: <input type="text"></input></span>
                <span className="jobsbutton">Email: <input type="text"></input></span>
        </div>
    )
}

export default SignUp