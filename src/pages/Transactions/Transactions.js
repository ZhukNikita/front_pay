import NavBar from '../../components/NavBar'
import styles from '../../styles/Transactions.module.scss'
import TransactionsBody from './TransactionsBody'


export default function Transactions() {
    return(
        <div className={styles.body}>
            <NavBar/>
            <TransactionsBody/>
        </div>
    )
}