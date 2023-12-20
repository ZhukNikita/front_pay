import NavBar from '../../components/NavBar'
import styles from './RuCassaTransactions.module.scss'
import RuCassaDeletedTransactionsBody from './RuCassaDeletedTransactionsBody'


export default function RuCassaDeletedTransactions() {
    return(
        <div className={styles.body}>
            <NavBar/>
            <RuCassaDeletedTransactionsBody/>
        </div>
    )
}