import { useNavigate, useLocation } from "react-router-dom"

const NavBar = () =>{
    const navigate = useNavigate()

    if (location.pathname === "/" || location.pathname === "/login") return <h1>Odd Jobs</h1>

    return(
    <div>
        <h1> Odd Jobs</h1>
        <nav>
            <button onClick={() => navigate('/create')}>Create a Job</button>
            <button onClick={() => navigate('/jobs')}>Job List</button>
            <button>My Jobs</button>
        </nav>
    </div>
        
    )
}
export default NavBar