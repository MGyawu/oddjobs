import { useState } from "react";

const SignUp = () =>{
    //return <div>Sign Up Page Placeholder</div>

    return (
        <div>
            <table>
                <tr>Username: <input type="text"></input></tr>
                <tr>Password: <input type="text"></input></tr>
                <tr>First Name: <input type="text"></input></tr>
                <tr>Last Name: <input type="text"></input></tr>
                <tr>Email: <input type="text"></input></tr>
            </table>
            <button>Sign Up</button>
            <button>Log In</button>
        </div>
    )
}

export default SignUp