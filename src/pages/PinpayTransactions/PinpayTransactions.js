import NavBar from '../../components/NavBar'
import styles from './PinpayTransactions.module.scss'
import PinpayTransactionsBody from './PinpayTransactionsBody'


export default function PinpayTransactions() {
    return(
        <div className={styles.body}>
            <NavBar/>
            <PinpayTransactionsBody/>
        </div>
    )
}