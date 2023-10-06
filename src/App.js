import './App.css';
import PinPay from './components/PinPay'
import BrandMenu from './components/BrandMenu'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import PaymentsMethods from './components/PaymentsMethods';
import P2P from './components/P2P';
import NoMatch from './pages/NoMatch/NoMatch';
import Failure from './components/Failure';
import Success from './components/Success';
import Panel from './pages/Panel/Panel.js';
import Login from './pages/Login/Login.js';
import { useEffect, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';
import Transactions from './pages/Transactions/Transactions';
import PinpayTransactions from './pages/PinpayTransactions/PinpayTransactions';
import Methods from './pages/Methods/Methods';
import P2PTransactions from './pages/P2PTransations/P2PTransactions';
import P2PDeletedTransactions from './pages/P2PTransations/P2PDeletedTransactions';
import WlxTransactions from './pages/WLXTransactions/WlxTransactions'
import InsirexTransactions from './pages/InsirexTransactions/InsirexTransactions'
import WLX from './components/WLX'
import Statistics from './pages/Statistics/Statistics';
import $api from "./axios";

function App() {
  const [methods , setMethods] = useState([])
  const {pathname} = useLocation()
  useEffect(() => {
    const id = secureLocalStorage.getItem('userId');
    const createdBy = secureLocalStorage.getItem('userId');
    const fetchData = async () => {
      try {
        const response = await $api.post('/getMe', { id });

        const data = response.data; 
        if (data) {
          if(data.id === null){ 
            secureLocalStorage.removeItem('userId')
            secureLocalStorage.removeItem('methods')
            secureLocalStorage.removeItem('role')
            secureLocalStorage.removeItem('isLogged')
            secureLocalStorage.removeItem('brands')
            secureLocalStorage.removeItem('userBrand')
            secureLocalStorage.removeItem('userToken')
            // window.location.href = '/login'
          }else{
            setMethods(data.methods? data.methods : [])
            secureLocalStorage.setItem('userId', data.id);
            secureLocalStorage.setItem('methods', data.methods);
            secureLocalStorage.setItem('role', data.role);
            secureLocalStorage.setItem('brands', data.brands);
            secureLocalStorage.setItem('userBrand' , data.brand)
            secureLocalStorage.setItem('userToken' , data.user_token)
          }
        }
      } catch (e) {
        secureLocalStorage.removeItem('userId')
        secureLocalStorage.removeItem('methods')
        secureLocalStorage.removeItem('role')
        secureLocalStorage.removeItem('isLogged')
        secureLocalStorage.removeItem('brands')
        secureLocalStorage.removeItem('userBrand')
        secureLocalStorage.removeItem('userToken')
        // window.location.href = '/login'
        console.log(e.response.data.message);
      }
    };
    if(secureLocalStorage.getItem('isLogged') !== null){
      fetchData(); 
    }
  }, [pathname]);
  return (
    <div className="App">
      <Routes>
        <Route path={'/pinpay'} element={<PinPay />} />
        <Route path={'/'} element={<BrandMenu />} />
        <Route path={'/payments_methods'} element={<PaymentsMethods />} />
        <Route path={'/methods'} element={<Methods/>} />
        <Route path={'/p2p'} element={<P2P />} />
        <Route path='*' element={<NoMatch />} />
        <Route path='/failure' element={<Failure />} />
        <Route path='/success' element={<Success />} />
        <Route path='/panel' element={<Panel />} />
        <Route path='/transactions' element={<Transactions/>} />
        <Route path='/pinpay-transactions' element={<PinpayTransactions/>} />
        <Route path='/p2p-transactions' element={<P2PTransactions/>} />
        <Route path='/p2p-deleted-transactions' element={<P2PDeletedTransactions/>} />
        <Route path='/wlx-transactions' element={<WlxTransactions/>} />
        <Route path='/insirex-transactions' element={<InsirexTransactions/>} />
        
        <Route path='/login' element={<Login />} />
        <Route path='/statistics' element={<Statistics />} />
        <Route path='/wlx' element={<WLX />} />
      </Routes>
    </div>
  );
}

export default App;