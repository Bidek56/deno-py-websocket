import { React } from '../deps.ts'
import { NewTask } from './NewTask.tsx'
import NavBar from './NavBar.tsx'
import Login from './Login.tsx'

const App = () => {

	const [valueCount, setValueCount] = React.useState<number>(0);
	const [userCount, setUserCount] = React.useState<number>(0);
    const [token, setToken] = React.useState<string | null>(null)

    const logout = async () => {

        try {
            const response = await fetch('/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({ token })
            });
            // console.log("Logout res:", response)

            setToken(null)
        } catch (e) {
            console.log("Read token error:", e);
        }
    }

    const readToken = async () => {
        try {
            const response = await fetch('/auth/token');

            // console.log("Token res:", response)

            if (response.ok) {
                const body = await response.json()
                if (body?.token) {
                    setToken(body?.token)
                } else if (body?.error) {
                    setToken(null)
                }                
            }
        } catch (e) {
            console.log("Read token error:", e);
        }
    };

    React.useEffect(() => {
        readToken();
    }, []);

    return (
        <React.Fragment>
            { token ?
                <div>
                    <NavBar logout={logout} />
                    <br/>
                    <NewTask/> 
                    <br/>
                </div> : <Login setToken={setToken} />
            }
        </React.Fragment>
   )
}

export default App