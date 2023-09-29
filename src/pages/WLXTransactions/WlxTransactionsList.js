import styles from './WlxTransactionsList.module.scss';
import {useState,useEffect} from 'react'
import axios from 'axios'
import Transaction from './Transaction';
import { Pagination } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
export default function WlxTransactionsList() {
    const [transactions, setTransactions] = useState([])
    const [search, setSearch] = useState('')
    const [usersPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const totalFilteredUsers = transactions.length;
    const totalPageCount = Math.ceil(totalFilteredUsers / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUser = transactions.slice(indexOfFirstUser, indexOfLastUser);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    console.log(transactions[0])
    return(
        <div className={styles.transactionsList}>
            <div className={styles.search}>
                <input
                    name='Search'
                    placeholder="Поиск"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <LinearProgress sx={{width:'40%'}} color="success"/>
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
                currentUser.map(el=> <Transaction key={el.id} setTransactions={setTransactions} transaction={el}/>)
            }
                  <div
                        style={{
                        width: '97%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems:'center',
                        padding: '10px 10px 10px 10px',
                        margin:'0 auto',
                        }}
                    >
                        <span style={{color:'white'}}>Всего транзакций: {transactions.length}</span>
                        <Pagination
                        count={totalPageCount}
                        color="primary"
                        shape="rounded"
                        page={currentPage}
                        onChange={(event, page) => paginate(page)}
                        />
                    </div>
        </div>
    )
}