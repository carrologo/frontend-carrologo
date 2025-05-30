import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import "./loginForm.css"

export default function loginForm () {
  return ( 
    <form className="login-form">
      <img src="/public/svg/logos/login-Banner.webp" alt="logo" className="login-logo" />
      <TextField margin='normal' id="outlined-basic" label="Usuario asignado" variant="outlined" />
      <TextField margin='normal' id="outlined-basic" label="Contraseña asignada" variant="outlined" type='password' />
      <Button size='large' variant="contained" onClick={()=> {
        alert("Iniciar sesion")
      }}>Iniciar Sesion</Button>
    </form>
  )
}

