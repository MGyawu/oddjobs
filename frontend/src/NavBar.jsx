import { useNavigate, useLocation } from "react-router-dom"

const NavBar = () =>{
    const navigate = useNavigate()

    if (location.pathname === "/") return <h1>Odd Jobs</h1>

    return(
    <div>
        <h1> Odd Jobs</h1>
        <nav>
            <button>Create a Job</button>
            <button>Job List</button>
            <button>My Jobs</button>
        </nav>
    </div>
        
    )
}
export default NavBar