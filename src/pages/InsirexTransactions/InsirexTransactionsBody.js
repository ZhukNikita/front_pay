import InsirexTransactionsList from "./InsirexTransactionsList"
import styles from './InsirexTransactionsBody.module.scss'

export default function InsirexTransactionsBody(params) {
    return(
        <div className={styles.body}>
        <div className={styles.header}>
            <h1>Транзакции Insirex</h1>
        </div>
        <InsirexTransactionsList/>
    </div>
    )
}