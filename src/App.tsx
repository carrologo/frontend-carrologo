import { Routes,Route } from 'react-router-dom'
import Login from './components/pages/login/Login'
import './App.css'
import Clients from './components/pages/clients/Clients'
import { ModalCreateClient } from './components/templates/modal-create-client/ModalCreateClient'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<ModalCreateClient />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clientes" element={<Clients/>} />
      </Routes>
    </>
  )
}

export default App
