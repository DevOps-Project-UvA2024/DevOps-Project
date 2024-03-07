import {Link, useMatch, useResolvedPath} from "react-router-dom";
import "../styles/navbar.css";
import { Button } from 'antd';

const NavBar = () => {

    const initSignout = async () => {
        try {
            const response = await fetch(`${window.location.origin}/api/users/auth/signout`);
            if (!response.ok) throw new Error('Error while signing out');
            window.location.reload()
          } catch (error) {
            console.error(error);
          }
    }

    return (
        <nav className="nav">
            <div className="nav-elements">
                <Link to="/greeting" className="site-title">Student Portal</Link>
                <ul>
                <CustomLink to="/courses">
                    Courses
                </CustomLink>
                {/* <CustomLink onClick={initSignout}>
                    Logout
                </CustomLink> */}
                <Button onClick={initSignout}>
                    Logout
                </Button>
                </ul>


            </div>
            
        </nav>
    );
};

function CustomLink({to,children,onClick,...props}){
    
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({path:resolvedPath.pathname});

    return (
    // if pathname is equal to href then the classname is
    <li className={isActive ? "active": ""}>              
        <Link to={to}{...props} onClick={onClick}>
            {children}
        </Link>
    </li>)
}
export default NavBar;
