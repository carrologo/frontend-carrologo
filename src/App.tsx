import { Routes,Route } from 'react-router-dom'
import Login from './components/pages/login/Login'
import './App.css'
import { ModalCreateClient } from './components/templates/modal-create-client/ModalCreateClient'
import Clients from './components/pages/clients/Clients'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<ModalCreateClient />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clientes" element={<Clients />} />
      </Routes>
    </>
  )
}

export default App
