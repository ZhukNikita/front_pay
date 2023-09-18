import './App.css';
import PinPay from './components/PinPay'
import BrandMenu from './components/BrandMenu'
import {Routes, redirect , Route , useLocation, Navigate} from 'react-router-dom'
import PaymentsMethods from './components/PaymentsMethods';
import P2P from './components/P2P';
import NoMatch from './pages/NoMatch/NoMatch';
import Failure from './components/Failure';
import Success from './components/Success';
import Panel from './pages/Panel/Panel.js';
import Login from './pages/Login/Login.js';
import  secureLocalStorage  from  "react-secure-storage";;


function App() {
  const { pathname } = useLocation();

  if(pathname !== '/p2p'){
    localStorage.removeItem('key')
    localStorage.removeItem('iban')
  }

  return (
    <div className="App">
      <Routes>
        <Route path={'/pinpay'} element={<PinPay/>}/>
        <Route path={'/'} element={<BrandMenu/>}/>
        <Route path={'/payments_methods'} element={<PaymentsMethods/>}/>
        <Route path={'/p2p'} element={<P2P/>}/>
        <Route path='*' element={<NoMatch/>}/>
        <Route path='/failure' element={<Failure/>}/>
        <Route path='/success' element={<Success/>}/>
        <Route path='/panel' element={<Panel/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </div>
  );
}

export default App;