import {React, ReactCookie} from '../deps.ts'
import { NewTask } from './NewTask.tsx'
import NavBar from './NavBar.tsx'
import Login from './Login.tsx'

const App: React.FC = (): JSX.Element => {

    const [userJob, setUserJob] = React.useState([]);

	const [valueCount, setValueCount] = React.useState(0);
	const [userCount, setUserCount] = React.useState(0);

    const [token, setToken] = React.useState<string | null>(null)
	const [cookies, ,removeCookie] = ReactCookie.useCookies(['token']);

    const logout = () => {
        removeCookie("token");
        setToken(null)
    } 

    const readCookie = async () => {
        try {
            const response = await fetch('/auth/token');

            // console.log("Token res:", response)

            if (response.ok) {
                const body = await response.json()
                if (body?.token) {
                    setToken(body?.token)
                }
            }

        } catch (e) {
            console.log("Read cookie error:", e);
        }
    };

    React.useEffect(() => {
        readCookie();
    }, []);

    return (
        <ReactCookie.CookiesProvider>
            <React.Fragment>
                { token || (cookies && cookies.token) ? 
                    <div>
                        <NavBar logout={logout} />
                        <br/>
                        <NewTask/> 
                        <br/>
                    </div> : <Login setToken={setToken} />
                }
            </React.Fragment>
        </ReactCookie.CookiesProvider>
   )
}

export default App