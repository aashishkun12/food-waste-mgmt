import { Link } from "react-router-dom"

const NavBar = () => {
    return (
        <>
            <div className="flex justify-around bg-red-700 p-2">
                <Link to="/">Home</Link>
                <Link to="/contact">Contact</Link>
            </div>
        </>
    )
}

export default NavBar