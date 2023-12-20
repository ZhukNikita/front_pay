import NavBar from '../../components/NavBar'
import styles from './RuCassaTransactions.module.scss'
import RuCassaTransactionsBody from './RuCassaTransactionsBody'
import secureLocalStorage from 'react-secure-storage'
import { Navigate } from 'react-router-dom'

export default function RuCassaTransactions() {
    if(!secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/login'}/>
    }
    if(secureLocalStorage.getItem('role') === 'User' && secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/payments_methods'}/>
    }
    return(
        <div className={styles.body}>
            <NavBar/>
            <RuCassaTransactionsBody/>
        </div>
    )
}