import NavBar from '../../components/NavBar'
import styles from './P2PTransactions.module.scss'
import P2PTransactionsBody from './P2PTransactionsBody'
import secureLocalStorage from 'react-secure-storage'
import { Navigate } from 'react-router-dom'

export default function P2PTransactions() {
    if(!secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/login'}/>
    }
    if(secureLocalStorage.getItem('role') === 'User' && secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/payments_methods'}/>
    }
    return(
        <div className={styles.body}>
            <NavBar/>
            <P2PTransactionsBody/>
        </div>
    )
}