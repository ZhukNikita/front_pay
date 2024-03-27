import NavBar from '../../components/NavBar'
import styles from './NowPayTransactions.module.scss'
import NowPayTransactionsBody from './NowPayTransactionsBody'
import secureLocalStorage from 'react-secure-storage'
import { Navigate } from 'react-router-dom'


export default function NowPayTransactions() {
  if(!secureLocalStorage.getItem('isLogged')){
    return <Navigate to={'/login'}/>
  }
  if(secureLocalStorage.getItem('role') === 'User' && secureLocalStorage.getItem('isLogged')){
    return <Navigate to={'/payments_methods'}/>
  }
  if(!secureLocalStorage.getItem('methods').includes('NowPay')){
    return <Navigate to={'/payments_methods'}/>
  }
  return(
    <div className={styles.body}>
      <NavBar/>
      <NowPayTransactionsBody/>
    </div>
  )
}