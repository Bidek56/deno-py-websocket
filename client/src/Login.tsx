import {React, ReactCookie, PropTypes} from './deps.ts'

const Login: React.FC<{ setUser: (username: string | null) => void }> = ({ setUser }): JSX.Element => {

    // const userRef = React.useRef<string>('');
    const userRef = React.useRef<HTMLInputElement | null>(null);
    const passRef = React.useRef<string>('');
    const [, setCookie] = ReactCookie.useCookies(['etl-token']);

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // console.log("User:", userRef?.current.value)

        // if (!userRef?.current?.length) {
        //     console.log('Missing user')
        //     // alert('Error: Missing user name')
        //     setUser(null)
        //     return
        // }

        if (!passRef.current.length) {
            console.log('Missing password')
            // alert('Error: Missing password')
            setUser(null)
            return
        }

        // getUser({ variables: { name: userRef.current, password: passRef.current } })
    }

    // onChange={e => userRef.current = (<HTMLInputElement>event.target).value}
    // onChange={e => passRef.current = (<HTMLInputElement>event.target).value}  

    // const updateUser = (event: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(event.currentTarget.value)
        // console.log((event.target as HTMLInputElement).value);
        // console.log((event.target as HTMLInputElement).value);
        // var inputValue = (<HTMLInputElement>document.getElementById("exampleInputEmail1")).value;
        // userRef.current = event.target.value;
    // }

    return (
        <form id="loginForm" noValidate onSubmit={handleSignIn}>
            <h3>Sign In</h3>

            <div className="form-group mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input id="exampleInputEmail1" type="email" className="form-control" placeholder="Enter email" ref={userRef}/>
            </div>

            <div className="form-group mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" placeholder="Enter password"  />
            </div>

            <div className="mb-3 form-group">
                <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id="customCheck1" />
                    <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">Submit</button>
        </form>
    );
}

Login.propTypes = {
    setUser: PropTypes.func.isRequired
}

export default Login;