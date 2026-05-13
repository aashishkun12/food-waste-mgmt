const Footer = () => {
    
    const year = new Date().getFullYear();
    return (
        <>
            <p className="text-center bg-black text-white p-2">&copy; {year} Food Waste Management System. All rights reserved.</p>
        </>
    )
}

export default Footer