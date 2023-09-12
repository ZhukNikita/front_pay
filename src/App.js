import './App.css';
import GlobalPayments from './components/GlobalPayments'
import BrandMenu from './components/BrandMenu'
import {Routes, redirect , Route , useLocation} from 'react-router-dom'
import PaymentsMethods from './components/PaymentsMethods';
import P2P from './components/P2P';


function App() {

  return (
    <div className="App">
      <Routes>
        <Route path={'/global_payments'} element={<GlobalPayments/>}/>
        <Route path={'/'} element={<BrandMenu/>}/>
        <Route path={'/payments_methods'} element={<PaymentsMethods/>}/>
        <Route path={'/p2p'} element={<P2P/>}/>
      </Routes>
    </div>
  );
}

export default App;