import styles from '../../styles/TransactionsBody.module.scss'
import TransactionsChart from './TransactionsChart'

export default function Transactions() {
    return(
        <div className={styles.body}>
            <div className={styles.header}>
                <h1>Транзакции</h1>
            </div>
            <div className={styles.chart}>
                <h3>Статус транзакций</h3>
                <TransactionsChart/>
                <div className={styles.descriptions}>
                    <div className={styles.description}>
                        <div style={{backgroundColor:'#325A96' , width:'14px' , height:'14px', borderRadius:'50%'}}></div>
                        <h4>Ждёт подтверждение</h4>
                    </div>
                    <div className={styles.description}>
                        <div style={{backgroundColor:'rgb(255, 72, 66)' , width:'14px' , height:'14px', borderRadius:'50%'}}></div>
                        <h4>Нет подтверждения</h4>
                    </div>
                    <div className={styles.description}>
                        <div style={{backgroundColor:'rgb(84, 214, 44)' , width:'14px' , height:'14px', borderRadius:'50%'}}></div>
                        <h4>Подтверждено</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}