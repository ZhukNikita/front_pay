import styles from './WlxTransactionsBody.module.scss'
import WlxTransactionsList from './WlxTransactionsList'

export default function WlxTransactionBody(){
    return(
        <div className={styles.body}>
            <div className={styles.header}>
                <h1>Транзакции WLX</h1>
            </div>
            <WlxTransactionsList/>
        </div>
    )
}