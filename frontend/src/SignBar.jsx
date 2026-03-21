import { useNavigate, useLocation } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "./App"

const SignBar = () =>{
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserContext)

    if (location.pathname === "/create" || location.pathname.includes("/jobs")) return null//location.pathname === "/jobs") return null
    
    const NavFromSignUp = async () => {
        if (location.pathname === "/"){
            try {
                const response = await fetch("/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: user.username,
                        password: user.password,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                    }),
                })
                const data = await response.json()
                if (!response.ok) {
                    alert(data.message)
                    return
                }
                const userResponse = await fetch(`/api/users/${data.userid}`)
                if (userResponse.ok) {
                    const userData = await userResponse.json()
                    setUser(userData)
                }
                navigate('/jobs')
            } catch (error) {
                alert("Error creating user. Please try again.")
            }
            return
        }
        if (location.pathname === "/login"){
            navigate('/')
            return
        }
    }

    const NavFromLogIn = async () => {
        if (location.pathname === "/login"){

            try{
                const response = await fetch ("/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: user.username,
                        password: user.password
                    })
                })
                const data = await response.json()
                if (!response.ok) {
                    alert(data.message)
                    return
                }
                setUser(data)
            } catch (error){
                alert("Authentication Error, Please try again")
            }

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