import {React, PropTypes} from '../deps.ts'

type  LoginProps = { setToken: (username: string | null) => void, }

const Login = ({ setToken }: LoginProps ) => {

    const userRef = React.useRef<HTMLInputElement | null>(null);
    const passRef = React.useRef<HTMLInputElement | null>(null);
    const [error, setError] = React.useState<string | null>(null)

    const getUser = async () => {

        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ user: userRef?.current?.value, pass: passRef?.current?.value })
        })

        if (response.ok) {
            const body = await response.json()
            
            if (body?.data?.accessToken) {
                setToken(body?.data?.accessToken)
            } else if (body?.status === "error" && body?.message) {
                setError(body?.message);
                setToken(null);
            }
        }       
    }

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (!userRef?.current?.value) {
            console.log('Missing user')
            setError('Missing user')
            setToken(null)
            return
        }

        if (!passRef?.current?.value) {
            console.log('Missing password')
            setError('Missing password')
            // alert('Error: Missing password')
            setToken(null)
            return
        }

        getUser()
    }

    return (
        <div className="wrapper fadeInDown">
            <div id="formContent">
                <form id="loginForm" noValidate onSubmit={handleSignIn}>
                    <h3>Sign In</h3>

                    <input type="text" id="user" className="fadeIn second" name="user" placeholder="user name" ref={userRef} />
                    <input type="text" id="password" className="fadeIn third" name="pass" placeholder="password" ref={passRef}/>
                    <input type="submit" className="fadeIn fourth" value="Log In" />
                    { error && <div><br/><b style={{ background: 'red', color: 'white' }}>{error}</b></div> }
                </form>
            </div>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default Login;