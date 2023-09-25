import { useState } from 'react'
import styles from './P2PTransactionsBody.module.scss'
import P2PTransactionsList from './P2PTransactionsList'

export default function P2PTransactionsBody() {
    return(
        <div className={styles.body}>
            <div className={styles.header}>
                <h1>Транзакции P2P</h1>
            </div>
            <P2PTransactionsList/>
        </div>
    )
}