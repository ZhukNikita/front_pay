import { useState } from 'react'
import styles from './P2PTransactionsBody.module.scss'
import P2PTransactionsList from './P2PTransactionsList'
import secureLocalStorage from 'react-secure-storage'
import {Link} from 'react-router-dom'
export default function P2PTransactionsBody() {
    return(
        <div className={styles.body}>
            <div className={styles.header}>
                <h1>Транзакции P2P</h1>
                {
                    secureLocalStorage.getItem('role') === 'SuperAdmin'?
                    <Link to={'/p2p-deleted-transactions'} className={styles.deletedTransactions}>Удаленные транзакции</Link>
                    : <></>
                }
            </div>
            <P2PTransactionsList/>
        </div>
    )
}