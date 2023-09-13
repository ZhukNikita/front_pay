import './App.css';
import GlobalPayments from './components/GlobalPayments'
import BrandMenu from './components/BrandMenu'
import {Routes, redirect , Route , useLocation} from 'react-router-dom'
import PaymentsMethods from './components/PaymentsMethods';
import P2P from './components/P2P';
import NoMatch from './components/NoMatch';

function App() {
  const { pathname } = useLocation();

  if(pathname !== '/p2p'){
    localStorage.removeItem('key')
    localStorage.removeItem('iban')
  }
  return (
    <div className="App">
      <Routes>
        <Route path={'/pinpay'} element={<GlobalPayments/>}/>
        <Route path={'/'} element={<BrandMenu/>}/>
        <Route path={'/payments_methods'} element={<PaymentsMethods/>}/>
        <Route path={'/p2p'} element={<P2P/>}/>
        <Route path='*' element={<NoMatch/>}/>
      </Routes>
    </div>
  );
}

export default App;