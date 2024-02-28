import {Link, useMatch, useResolvedPath} from "react-router-dom"
import "../styles/navbar.css"

const NavBar = () => {
    return (
        <nav className="nav">
            <Link to="/" className="site-title">Student Portal</Link>
            <ul>
                <CustomLink to="/courses">
                    Courses
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
    
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({path:resolvedPath.pathname});

    const initSignout = async () => {
        try {
            const response = await fetch('api/users/auth/signout');
            if (!response.ok) throw new Error('Error while signing out');
            window.location.reload()
          } catch (error) {
            console.error(error);
          }
    }

    return (
    // if pathname is equal to href then the classname is
    <li className={isActive ? "active": ""}>              
        <Link to={to}{...props} onClick={initSignout}>
            {children}
        </Link>
    </li>)
}
export default NavBar;
