import {React, ReactCookie} from './deps.ts'
import NewTask from './NewTask.tsx'
import NavBar from './NavBar.tsx'

const Main: React.FC = (props: any) => {

    const [userJob, setUserJob] = React.useState([]);

	const [valueCount, setValueCount] = React.useState(0);
	const [userCount, setUserCount] = React.useState(0);

	const [user, setUser] = React.useState<string | null>("admin")
	const [cookies, , removeCookie] = ReactCookie.useCookies(['token']);

    const logout = () => {
        removeCookie("token");
        setUser(null)
    }

    return (
        <ReactCookie.CookiesProvider>        
            <React.Fragment>
                { user || (cookies && cookies.token) ? 
                <div>
                    <NavBar logout={logout} />
                    <br/>
                    <NewTask/> 
                    <br/>
                </div> : <div>Login</div> }
            </React.Fragment>
        </ReactCookie.CookiesProvider>
   )
}

export default Main