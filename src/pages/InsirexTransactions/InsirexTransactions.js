import styles from './InsirexTransactions.module.scss'
import InsirexTransactionsBody from './InsirexTransactionsBody'
import NavBar from '../../components/NavBar'
import secureLocalStorage from 'react-secure-storage'
import { Navigate } from 'react-router-dom'

export default function InsirexTransactions() {
    if(!secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/login'}/>
    }
    if(secureLocalStorage.getItem('role') === 'User' && secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/payments_methods'}/>
    }
    return(
        <div className={styles.body}>
            <NavBar/>
            <InsirexTransactionsBody/>
        </div>
    )
}