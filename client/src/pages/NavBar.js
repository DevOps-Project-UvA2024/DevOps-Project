import {Link, useMatch, useResolvedPath} from "react-router-dom"

const NavBar = () => {
    const path = window.location.pathname
    return (
        <nav className="nav">
            <Link to="/" className="site-title">Student Portal</Link>
            <ul>
                <CustomLink to="/masters">
                    Masters
                </CustomLink>
                <CustomLink to="/account">
                    Account
                </CustomLink>
                <CustomLink to="/signin">
                    Logout
                </CustomLink>
            </ul>
        </nav>
    );
};

function CustomLink({to,children,...props}){
    
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({path:resolvedPath.pathname})
    return (
    // if pathname is equal to href then the classname is
    <li className={isActive ? "active": ""}>              
        <Link to={to}{...props}>
            {children}
        </Link>
    </li>)
}
export default NavBar;
