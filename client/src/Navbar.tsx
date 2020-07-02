import {React, PropTypes} from './deps.ts'

const NavBar: React.FC<{ logout: () => void }> = ({ logout }): JSX.Element => {

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <a className="nav-link" href="/">Home</a>
                </li>
                <li className="nav-item" style={{float:'right'}}><a className="nav-link" href="/" onClick={logout}>Logout</a></li>
            </ul>
        </nav>
    );
}

NavBar.propTypes = {
    logout: PropTypes.func.isRequired
}

export default NavBar;