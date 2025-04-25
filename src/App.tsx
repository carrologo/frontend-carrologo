import { Routes,Route } from 'react-router-dom'
import Login from './components/pages/login/Login.tsx'
import './App.css'
import Clients from './components/pages/clients/Clients'
import Header from './components/organisms/navbar/header'

function App() {

  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Header />}>
          <Route path="/clientes" element={<Clients/>} />
        </Route>
      </Routes>
  )
}

export default App
