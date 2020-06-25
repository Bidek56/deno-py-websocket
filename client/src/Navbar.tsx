import {React, PropTypes} from './deps.ts'

const NavBar: React.FC<{ logout: () => void }> = ({ logout }): JSX.Element => {

    return (
        <ul>
            <li><a className="active" href="/">Home</a></li>
            {/* <li><a href="#news">News</a></li>
            <li><a href="#contact">Contact</a></li> */}
            <li style={{float:'right'}}><a href="/" onClick={logout}>Logout</a></li>
        </ul>
    );
}

NavBar.propTypes = {
    logout: PropTypes.func.isRequired
}

export default NavBar;