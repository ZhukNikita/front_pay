import './App.css';
import PinPay from './components/PinPay'
import BrandMenu from './components/BrandMenu'
import {Routes, Route} from 'react-router-dom'
import PaymentsMethods from './components/PaymentsMethods';
import P2P from './components/P2P';
import NoMatch from './components/NoMatch';
import Failure from './components/Failure';
import Success from './components/Success';
import WLXPayment from "./components/WLX";

function App() {

 
  return (
    <div className="App">
      <Routes>
        <Route path={'/pinpay'} element={<PinPay/>}/>
        <Route path={'/wlx'} element={<WLXPayment/>}/>
        <Route path={'/'} element={<BrandMenu/>}/>
        <Route path={'/payments_methods'} element={<PaymentsMethods/>}/>
        <Route path={'/p2p'} element={<P2P/>}/>
        <Route path='*' element={<NoMatch/>}/>
        <Route path='/failure' element={<Failure/>}/>
        <Route path='/success' element={<Success/>}/>
      </Routes>
    </div>
  );
}

export default App;