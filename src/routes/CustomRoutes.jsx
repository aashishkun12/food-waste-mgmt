import { Routes, Route } from "react-router-dom"

import Mainlayout from "../layout/Mainlayout"
import AuthLayout from "../layout/AuthLayout"

import Home from "../pages/Home"
import Contact from "../pages/Contact"
import Login from "../pages/Login"
import Signup from "../pages/Signup"

const CustomRoutes = () => {
    return (
        <>
        <Routes>
            <Route element={<Mainlayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
            </Route>

            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Route>
        </Routes>
        </>
    )
}

export default CustomRoutes