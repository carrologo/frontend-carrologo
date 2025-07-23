import { Routes,Route } from 'react-router-dom'
import Login from './components/pages/login/Login.tsx'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'
import Clients from './components/pages/clients/Clients'
import Header from './components/organisms/navbar/header'
import Vehicles from './components/pages/vehicles/Vehicles.tsx'
import Transactions from './components/pages/transactions/Transactions.tsx'
import Home from './components/pages/home/home.tsx'
import ProtectedRoute from './components/organisms/protected-route/ProtectedRoute'
import TestDocumentUpload from './components/test/TestDocumentUpload'
import { getToken } from './core/api/api.ts';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === '/' && getToken()) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/test-upload" element={<TestDocumentUpload />} />
      <Route element={
        <ProtectedRoute>
          <Header />
        </ProtectedRoute>
      }>
        <Route path="/clientes" element={<Clients/>} />
        <Route path='/vehiculos' element={<Vehicles/>}/>
        <Route path="/transacciones" element={<Transactions />} />
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
