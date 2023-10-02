import { useState } from 'react'
import styles from './P2PTransactionsBody.module.scss'
import P2PDeletedTransactionsList from './P2PDeletedTransactionsList'
import secureLocalStorage from 'react-secure-storage'
import {Link} from 'react-router-dom'

export default function P2PTransactionsBody() {
    return(
        <div className={styles.body}>
            <div className={styles.header}>
                <h1>Удалённые транзакции P2P</h1>
                {
                    secureLocalStorage.getItem('role') === 'SuperAdmin'?
                    <Link to={'/p2p-transactions'} className={styles.deletedTransactions}>Созданные транзакции</Link>
                    : <></>
                }
            </div>
            <P2PDeletedTransactionsList/>
        </div>
    )
}