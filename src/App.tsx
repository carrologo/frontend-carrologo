import { Routes,Route } from 'react-router-dom'
import Login from './components/pages/login/Login'
import './App.css'
import { ModalClient } from './components/organisms/modal-client/ModalClient'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<ModalClient />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
