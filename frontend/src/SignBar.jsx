import { useNavigate, useLocation } from "react-router-dom"

const SignBar = () =>{
    const navigate = useNavigate()

    if (location.pathname === "/create" || location.pathname === "/jobs") return null

    const NavFromSignUp = () => {
        if (location.pathname === "/"){
            navigate('/jobs')
            return
        }
        if (location.pathname === "/login"){
            navigate('/')
            return
        }
    }

    const NavFromLogIn = () => {
        if (location.pathname === "/login"){
            navigate('/jobs')
            return
        }
        if (location.pathname === "/"){
            navigate('/login')
            return
        }
    }

    return(
    <div>
        <nav>
            <button onClick={() => NavFromSignUp()}>Sign Up</button>
            <button onClick={() => NavFromLogIn()}>Log In</button>
        </nav>
    </div>
        
    )
}
export default SignBar