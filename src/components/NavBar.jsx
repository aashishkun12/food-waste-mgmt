import { Link } from "react-router-dom"
import { RiLoginBoxFill } from "react-icons/ri";

const NavBar = () => {
    return (
        <>
            <div className="flex justify-around bg-blue-500 text-white p-2">
                <Link to="/">Home</Link>
                <Link to="/contact">Contact</Link>

                <Link to="/login" className="border flex gap-2 items-center rounded p-1 pointer hover:text-blue-200">
                    <RiLoginBoxFill />
                    <span>Sign in</span>
                </Link>
            </div>
        </>
    )
}

export default NavBar