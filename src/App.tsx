import { Routes,Route } from 'react-router-dom'
import Login from './components/pages/login/Login'
import './App.css'
import { ModalCreateClient } from './components/templates/modal-create-client/ModalCreateClient'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<ModalCreateClient />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
