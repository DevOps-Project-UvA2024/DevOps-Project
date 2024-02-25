// NavBar.js
const NavBar = () => {
    return (
        <nav className="nav">
            <a href="/" className="site-title">Student Portal</a>
            <ul>
                <li>
                    <a href="/masters">Masters</a>
                </li>
                <li>
                    <a href="/account">Account</a>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
