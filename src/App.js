import './App.css';
import AllTransactions from './pages/AllTransactions/AllTransactions.js';
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
import React , { useEffect, useState } from 'react';
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
import FullTransactionInfo from './pages/PinpayTransactions/FullTransactionInfo';
import FullShpTransactionInfo from './pages/ShpTransactions/FullTransactionInfo';
import FullInsirexTransactionInfo from './pages/InsirexTransactions/FullInfoTransaction.js';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AdvCash from './components/AdvCash';
import Shp from './components/Shp.js';
import NowPay from './components/NowPay.js';
import AdvCashTransactions from './pages/AdvCashTransactions/AdvCashTransactions.js';
import ShpTransactions from "./pages/ShpTransactions/ShpTransactions";
import FullP2PTransactionInfo from './pages/P2PTransations/FullInfoTransaction.js';
import RuCassa from './pages/RuCassa/RuCassa.js';
import RuCassaTransactions from './pages/RuCassaTransactions/RuCassaTransactions.js'
import LinkPay from "./components/LinkPay";
import LinkPayTransactions from './pages/LinkPayTransactions/LinkPayTransactions.js';
import P2PChoose from './pages/P2PTransations/P2PChoose.js';
import NowPayTransactions from "./pages/NowPayTransactions/NowPayTransactions";
import PrMoney from "./components/PrMoney";
import Readies from "./components/PrMoney";
import LinkWorld from './components/LinkWorld.js';
import LinkWorldTransactions from './pages/LinkWorld/LinkWorldTransactions.js';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function App() {
  const [methods , setMethods] = useState([])
  const {pathname} = useLocation()
  const [snack, setSnack] = useState(false);
  const [snackType, setSnackType] = useState('');
  const [snackMessage, setSnackMessage] = useState('');
  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setSnackMessage('')
    setSnack(false);
};
  useEffect(() => {
    const id = secureLocalStorage.getItem('userId');
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
            secureLocalStorage.removeItem('userLogin')

            // window.location.href = '/login'
          }else{
            setMethods(data.methods? data.methods : [])
            secureLocalStorage.setItem('userId', data.id);
            secureLocalStorage.setItem('methods', data.methods);
            secureLocalStorage.setItem('role', data.role);
            secureLocalStorage.setItem('brands', data.brands);
            secureLocalStorage.setItem('userBrand' , data.brand)
            secureLocalStorage.setItem('userToken' , data.user_token)
            secureLocalStorage.setItem('userLogin' , data.login)
            
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
        secureLocalStorage.removeItem('userLogin')
        // window.location.href = '/login'
        console.log(e.response?.data?.message);
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
        <Route path={'/shp.ee-transactions'} element={<ShpTransactions />} />
        <Route path={'/LinkWorld-transactions'} element={<LinkWorldTransactions/>} />
        <Route path={'/NowPay-transactions'} element={<NowPayTransactions />} />
        <Route path={'/LinkPay-transactions'} element={<LinkPayTransactions />} />
        <Route path={'/payments_methods'} element={<PaymentsMethods />} />
        <Route path={'/methods'} element={<Methods/>} />
        <Route path={'/p2p/:country'} element={<P2P />} />
        <Route path={'/p2p/choose'} element={<P2PChoose />} />
        <Route path='*' element={<NoMatch />} />
        <Route path='/failure' element={<Failure />} />
        <Route path='/success' element={<Success />} />
        <Route path='/panel' element={<Panel />} />
        {/* <Route path='/test' element={<Test />} /> */}
        {/* <Route path='/transactions' element={<Transactions/>} /> */}
        <Route path='/transactions' element={<AllTransactions/>} />
        <Route path='/pinpay-transactions' element={<PinpayTransactions/>} />
        {/* <Route path='/transaction/:id' element={<FullTransactionInfo setSnack={setSnack} setSnackMessage={setSnackMessage} setSnackType={setSnackType}/>} /> */}
        <Route path='/shp-transaction/:id' element={<FullShpTransactionInfo setSnack={setSnack} setSnackMessage={setSnackMessage} setSnackType={setSnackType}/>} />
        <Route path='/p2p-transactions' element={<P2PTransactions/>} />
        <Route path='/rucassa-transactions' element={<RuCassaTransactions/>} />
        <Route path='/p2p-transaction/:id' element={<FullP2PTransactionInfo setSnack={setSnack} setSnackMessage={setSnackMessage} setSnackType={setSnackType}/>} />

        {/*<Route path='/p2p-deleted-transactions' element={<P2PDeletedTransactions/>} />*/}
        {/* <Route path='/wlx-transactions' element={<WlxTransactions/>} /> */}
        {/* <Route path='/insirex-transactions' element={<InsirexTransactions/>} />
        <Route path='/insirex-transaction/:id' element={<FullInsirexTransactionInfo setSnack={setSnack} setSnackMessage={setSnackMessage} setSnackType={setSnackType}/>} /> */}
        {/*<Route path='/advcash-transactions' element={<AdvCashTransactions/>} />*/}
        <Route path='/login' element={<Login />} />
        {/*<Route path='/statistics' element={<Statistics />} />*/}
        <Route path='/wlx' element={<WLX />} />
        <Route path='/rucassa' element={<RuCassa />} />
        <Route path='/advcash' element={<AdvCash />} />
        <Route path='/shp' element={<Shp />} />
        <Route path='/readies' element={<Readies />} />
        <Route path='/linkworld' element={<LinkWorld />} />
        <Route path='/nowPay' element={<NowPay />} />
        <Route path='/linkpay' element={<LinkPay />} />
      </Routes>
      <Snackbar
          open={snack}
          autoHideDuration={4000}
          onClose={handleCloseSnack}
          message={snackMessage}
      >
          <Alert severity={snackType} sx={{fontFamily:"'Nunito',sans-serif" , fontSize:'15px'}}>{snackMessage}</Alert>
      </Snackbar>
    </div>
  );
}

export default App;