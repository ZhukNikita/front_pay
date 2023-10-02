import styles from './StatisticsBody.module.scss'
import TransactionsChart from '../Transactions/TransactionsChart'
import { useEffect, useState } from 'react'
import axios from 'axios'
export default function StatisticsBody(){
    const [transactions , setTransactions] = useState([])
    const [isLoading , setIsLoading] = useState(false)
    useEffect(()=>{
        const fetchData = async()=>{
            setIsLoading(true)
            try{
                const {data} = await axios.get('https://merchantaccount.dev/api/v1/payment-statuses/iycg4swp71f8hoq') 
                if(data){
                    setTransactions(data.data.reverse())
                    setIsLoading(false)
                }
            }
            catch(e){
                console.log(e)
            }
        }   
        fetchData()
    },[])

    const successValue = transactions.filter(el=>el.status === 'success')
    const pendingValue = transactions.filter(el=>el.status === 'pending')
    const failedValue = transactions.filter(el=>el.status === 'rejected' || el.status === 'timeout')
    return(
        <div className={styles.body}>
            <div className={styles.wlx}>
                <h1>Статистика WLX</h1>
                <div>
                    <TransactionsChart value={[successValue.length , pendingValue.length , failedValue.length]}/>
                </div>
            </div>
        </div>
    )
}