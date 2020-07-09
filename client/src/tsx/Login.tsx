import {React, PropTypes} from '../deps.ts'

const Login: React.FC<{ setToken: (username: string | null) => void, }> = ({ setToken }): JSX.Element => {

    const userRef = React.useRef<HTMLInputElement | null>(null);
    const passRef = React.useRef<HTMLInputElement | null>(null);
    const [error, setError] = React.useState<string | null>(null)

    const getUser = async () => {

        // const pass = await bcrypt.hash(passRef?.current?.value);

        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            // @ts-ignore
            body: JSON.stringify({ user: userRef?.current?.value, pass: passRef?.current?.value })
        })

        // console.log("Res OK:", response.ok)

        if (response.ok) {
            const body = await response.json()
            
            // console.log("Res:", body)
            // console.log("Token:", body?.data?.accessToken)

            if (body?.data?.accessToken) {
                setToken(body?.data?.accessToken)
            }
        }       
    }

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // @ts-ignore
        console.log("User:", userRef?.current?.value)

        // @ts-ignore
        if (!userRef?.current?.value) {
            console.log('Missing user')
            setError('Missing user')
            setToken(null)
            return
        }

        // @ts-ignore
        if (!passRef?.current?.value) {
            console.log('Missing password')
            setError('Missing password')
            // alert('Error: Missing password')
            setToken(null)
            return
        }

        // @ts-ignore
        // console.log({ variables: { user: userRef.current.value, password: passRef.current.value } })
        getUser()
    }

    return (
        <div className="wrapper fadeInDown">
            <div id="formContent">
                <form id="loginForm" noValidate onSubmit={handleSignIn}>
                    <h3>Sign In</h3>

                    <input type="text" id="login" className="fadeIn second" name="login" placeholder="login" ref={userRef} />
                    <input type="text" id="password" className="fadeIn third" name="login" placeholder="password" ref={passRef}/>
                    <input type="submit" className="fadeIn fourth" value="Log In" />
                    { error && <b style={{ background: 'red', color: 'white' }}>{error}</b> }
                </form>
            </div>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default Login;