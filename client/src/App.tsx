import {React, ReactCookie} from './deps.ts'
import { NewTask } from './NewTask.tsx'
import NavBar from './NavBar.tsx'
import Login from './Login.tsx'

const App: React.FC = (): JSX.Element => {

    const [userJob, setUserJob] = React.useState([]);

	const [valueCount, setValueCount] = React.useState(0);
	const [userCount, setUserCount] = React.useState(0);

	const [user, setUser] = React.useState<string | null>(null)
	const [cookies, ,removeCookie] = ReactCookie.useCookies(['token']);

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
                </div> : <Login setUser={setUser} />                 
                }
            </React.Fragment>
        </ReactCookie.CookiesProvider>
   )
}

export default App