import styles from './WlxTransactionsList.module.scss'


export default function Transaction({transaction}) {
    const date = new Date(transaction.created_at);
    const formattedDate = `${date.getDate()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    
    return(
        <div className={styles.transaction}>
            <div className={styles.body}>
            <h3 style={{ width: '7vw' }}>{formattedDate}</h3>
                <h3 style={{ width: '160px' }}>{transaction.uuid}</h3>
                <h3 style={{ width: '160px' }}>{transaction.currency}</h3>
                <h3 style={{ width: '10vw' }}>{transaction.customer_uid}</h3>
                <h3 style={{ width: '7vw' }}>{transaction.entered_amount}</h3>
                <h3 style={{ width: '9vw' }}>{transaction.sent_amount}</h3>
                <h3 style={{ width: '7vw' }}>
                    {transaction.status}
                </h3>
            </div>
        </div>
    )
}