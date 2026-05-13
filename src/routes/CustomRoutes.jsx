import { Routes, Route } from "react-router-dom"

import Mainlayout from "../layout/Mainlayout"
import Home from "../pages/Home"
import Contact from "../pages/Contact"

const CustomRoutes = () => {
    return (
        <>
        <Routes>
            <Route element={<Mainlayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
            </Route>
        </Routes>
        </>
    )
}

export default CustomRoutes