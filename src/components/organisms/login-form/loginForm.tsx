import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../../services/auth.service'
import { LoginRequest } from '../../../interfaces/auth.interface'
import { showWarningToast } from '../../../utils/toast.utils'
import "./loginForm.css"

export default function LoginForm () {
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      showWarningToast('Por favor ingrese usuario y contraseña');
      return;
    }

    setLoading(true);
    try {
      await login(credentials);
      navigate('/home');
    } catch (error) {
      // El toast de error ya se maneja en el servicio auth.service.ts
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return ( 
    <form className="login-form" onSubmit={(e) => e.preventDefault()}>
      <img src="/svg/logos/login-banner.webp" alt="logo" className="login-logo" />
      <TextField 
        className='login-input'
        margin='normal' 
        id="username" 
        label="Usuario asignado" 
        variant="outlined"
        value={credentials.username}
        onChange={(e) => handleInputChange('username', e.target.value)}
        disabled={loading}
      />
      <TextField 
        className='login-input'
        margin='normal' 
        id="password" 
        label="Contraseña asignada" 
        variant="outlined" 
        type={showPassword ? 'text' : 'password'}
        value={credentials.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button 
        size='large' 
        sx={{m: 2}} 
        variant="contained" 
        type="button"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  )
}

