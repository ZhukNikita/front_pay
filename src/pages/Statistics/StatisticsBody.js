import styles from './StatisticsBody.module.scss'
import TransactionsChart from '../Transactions/TransactionsChart'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Oval } from 'react-loader-spinner';

export default function StatisticsBody() {
    const [transactions, setTransactions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const { data } = await axios.get('https://merchantaccount.dev/api/v1/payment-statuses/iycg4swp71f8hoq')
                if (data) {
                    setTransactions(data.data.reverse())
                    setIsLoading(false)
                }
            }
            catch (e) {
                console.log(e)
            }
        }
        fetchData()
    }, [])

    const successValue = transactions.filter(el => el.status === 'success' )
    const pendingValue = transactions.filter(el => el.status === 'pending')
    const failedValue = transactions.filter(el => el.status === 'rejected' || el.status === 'timeout')
    let tempRUB= transactions.filter(el=> el.status === 'success' && el.currency === 'RUB')
    const totalSentAmountRub = tempRUB.reduce((sum, obj) => sum + obj.sent_amount, 0);
    let tempKZT= transactions.filter(el=> el.status === 'success' && el.currency === 'KZT')
    const totalSentAmountKZT = tempKZT.reduce((sum, obj) => sum + obj.sent_amount, 0);
    let tempINR= transactions.filter(el=> el.status === 'success' && el.currency === 'INR')
    const totalSentAmountINR = tempINR.reduce((sum, obj) => sum + obj.sent_amount, 0);

    function shortenNumber(value) {
        if (isNaN(value)) {
            return 'Invalid value';
        }
    
        if (Math.abs(value) >= 1000000) {
            return Math.floor(value / 1000000 * 100) / 100 + 'M';
        }
        
        if (Math.abs(value) >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        }
    
        return value;
    }
    return (
        <div className={styles.body}>
            <div className={styles.wlx}>
                <h1>Статистика WLX</h1>
                <div className={styles.wlxChart}>
                    <div className={styles.wlxPie}>
                        <h3>Транзакции WLX</h3>
                        {isLoading ?
                            <div style={{ height: '189px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Oval
                                    height={80}
                                    width={80}
                                    color="#181729"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                    ariaLabel='oval-loading'
                                    secondaryColor="#b7dce9"
                                    strokeWidth={2}
                                    strokeWidthSecondary={2}
                                />
                            </div>
                            : <TransactionsChart value={[successValue.length,  failedValue.length]} title={['Успешно', "Отклонено"]} totalTransactions={transactions.length} />}

                        <div className={styles.descriptions}>
                            <div className={styles.description}>
                                <div style={{ backgroundColor: 'rgb(255 45 38 / 76%)', width: '14px', height: '14px', borderRadius: '50%' }}></div>
                                <h4>Отклонено</h4>
                            </div>
                            <div className={styles.description}>
                                <div style={{ backgroundColor: 'rgb(34, 154, 22)', width: '14px', height: '14px', borderRadius: '50%' }}></div>
                                <h4>Успешно</h4>
                            </div>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardCircle}>RUB</div>
                        <div className={styles.cardBody}>
                            <h2>
                               Сумма: {shortenNumber(totalSentAmountRub)}
                            </h2>
                            <h3 >
                               Успешных транзакций: {transactions.filter(el => el.status === 'success' && el.currency === 'RUB' ).length}
                            </h3>
                            <h3 >
                               Отклоненных транзакций: {transactions.filter(el => (el.status === 'rejected' || el.status === 'timeout') && el.currency === 'RUB' ).length}
                            </h3>
                            <h3>
                               В обработке: {transactions.filter(el => (el.status === 'awaiting' || el.status === 'pending') && el.currency === 'RUB' ).length}
                            </h3>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardCircle}>KZT</div>
                        <div className={styles.cardBody}>
                            <h2>
                               Сумма: {shortenNumber(totalSentAmountKZT)}
                            </h2>
                            <h3>
                               Успешных транзакций: {transactions.filter(el => el.status === 'success' && el.currency === 'KZT' ).length}
                            </h3>
                            <h3>
                               Отклоненных транзакций: {transactions.filter(el => (el.status === 'rejected' || el.status === 'timeout') && el.currency === 'KZT' ).length}
                            </h3>
                            <h3>
                               В обработке: {transactions.filter(el => (el.status === 'awaiting' || el.status === 'pending') && el.currency === 'KZT' ).length}
                            </h3>
                        </div>
                    </div>                    
                    <div className={styles.card}>
                        <div className={styles.cardCircle}>INR</div>
                        <div className={styles.cardBody}>
                            <h2>
                               Сумма: {shortenNumber(totalSentAmountINR)}
                            </h2>
                            <h3>
                               Успешных транзакций: {transactions.filter(el => el.status === 'success' && el.currency === 'INR' ).length}
                            </h3>
                            <h3>
                               Отклоненных транзакций: {transactions.filter(el => (el.status === 'rejected' || el.status === 'timeout') && el.currency === 'INR' ).length}
                            </h3>
                            <h3>
                               В обработке: {transactions.filter(el => (el.status === 'awaiting' || el.status === 'pending') && el.currency === 'INR' ).length}
                            </h3>
                        </div>
                    </div>
                </div>


                <div>
                </div>
            </div>
        </div>
    )
}