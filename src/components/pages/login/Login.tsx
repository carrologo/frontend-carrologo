import "./Login.css"


const Login = () => {

    

    return( 
        <div className="container-login">
            <form className="login-form">
                <img src="/public/svg/logos/loginBanner.svg" alt="logo" className="login-logo" />
                <p> Username</p>
                <input type="text" placeholder="Usuario" required />
                <input type="password" placeholder="Contraseña" required />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;