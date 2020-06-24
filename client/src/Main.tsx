import {React, ReactCookie} from './deps.ts'
import NewTask from './NewTask.tsx'

const Main: React.FC = (props: any) => {

    const [userJob, setUserJob] = React.useState([]);

	const [valueCount, setValueCount] = React.useState(0);
	const [userCount, setUserCount] = React.useState(0);

	const [user, setUser] = React.useState("admin")
	const [cookies, , removeCookie] = ReactCookie.useCookies(['token']);

    return (
        <ReactCookie.CookiesProvider>        
            <React.Fragment>
                { user || (cookies && cookies.token) ? <NewTask/> : <div>Login</div> }
            </React.Fragment>
        </ReactCookie.CookiesProvider>
   )
}

export default Main