import NavBar from '../../components/NavBar'
import styles from './P2PTransactions.module.scss'
import P2PDeletedTransactionsBody from './P2PDeletedTransactionsBody'


export default function P2PDeletedTransactions() {
    return(
        <div className={styles.body}>
            <NavBar/>
            <P2PDeletedTransactionsBody/>
        </div>
    )
}