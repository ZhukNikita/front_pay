import NavBar from '../../components/NavBar'
import styles from './WlxTransactions.module.scss'
import WlxTransactionBody from './WlxTransactionsBody'


export default function P2PTransactions() {
    return(
        <div className={styles.body}>
            <NavBar/>
            <WlxTransactionBody/>
        </div>
    )
}

