import styles from './WlxTransactionsList.module.scss';
import {useState,useEffect} from 'react'
import axios from 'axios'
import Transaction from './Transaction';
import { Pagination } from '@mui/material';
export default function WlxTransactionsList() {
    const [transactions, setTransactions] = useState([])
    const [search, setSearch] = useState('')

    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const {data} = await axios.get('https://merchantaccount.dev/api/v1/payment-statuses/iycg4swp71f8hoq') 
                if(data){
                    setTransactions(data.data.reverse())
                }
            }
            catch(e){
                console.log(e)
            }
        }   
        fetchData()
    },[])
    console.log(transactions)
    return(
        <div className={styles.transactionsList}>
            <div className={styles.search}>
                <input
                    name='Search'
                    placeholder="Поиск"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className={styles.header}>
                <h3 style={{ width: '7vw' }}>Дата</h3>
                <h3 style={{ width: '160px' }}>ID Транзакции</h3>
                <h3 style={{ width: '7vw' }}>Валюта</h3>
                <h3 style={{ width: '10vw' }}>Пользователь</h3>
                <h3 style={{ width: '8vw' }}>Введённая сумма</h3>
                <h3 style={{ width: '9.5vw' }}>Отправленная сумма</h3>
                <h3 style={{ width: '7vw' }}>Статус</h3>
            </div>
            {
                transactions.map(el=> <Transaction key={el.id} setTransactions={setTransactions} transaction={el}/>)
            }
                  <div
                        style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'right',
                        padding: '10px 0px',
                        }}
                    >
                        <Pagination
                        // count={totalPageCount}
                        color="primary"
                        shape="rounded"
                        // page={currentPage}
                        // onChange={(event, page) => paginate(page)}
                        />
                    </div>
        </div>
    )
}