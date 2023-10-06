import NavBar from '../../components/NavBar'
import styles from './PinpayTransactions.module.scss'
import PinpayTransactionsBody from './PinpayTransactionsBody'
import secureLocalStorage from 'react-secure-storage'
import { Navigate } from 'react-router-dom'
export default function PinpayTransactions() {
    if(!secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/login'}/>
    }
    if(secureLocalStorage.getItem('role') === 'User' && secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/payments_methods'}/>
    }
    return(
        <div className={styles.body}>
            <NavBar/>
            <PinpayTransactionsBody/>
        </div>
    )
}