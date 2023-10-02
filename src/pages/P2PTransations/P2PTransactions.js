import NavBar from '../../components/NavBar'
import styles from './P2PTransactions.module.scss'
import P2PTransactionsBody from './P2PTransactionsBody'


export default function P2PTransactions() {
    return(
        <div className={styles.body}>
            <NavBar/>
            <P2PTransactionsBody/>
        </div>
    )
}