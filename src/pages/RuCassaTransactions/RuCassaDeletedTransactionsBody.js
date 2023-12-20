import { useState } from 'react'
import styles from './RuCassaTransactionsBody.module.scss'
import RuCassaDeletedTransactionsList from './RuCassaDeletedTransactionsList'
import secureLocalStorage from 'react-secure-storage'
import {Link} from 'react-router-dom'

export default function RuCassaTransactionsBody() {
    return(
        <div className={styles.body}>
            <div className={styles.header}>
                <h1>Удалённые транзакции P2P</h1>
                <div className={styles.buttons}>
                {
                    secureLocalStorage.getItem('role') === 'SuperAdmin'?
                    <Link to={'/p2p-transactions'} className={styles.deletedTransactions}>Созданные транзакции</Link>
                    : <></>
                }
                </div>

            </div>
            <RuCassaDeletedTransactionsList/>
        </div>
    )
}