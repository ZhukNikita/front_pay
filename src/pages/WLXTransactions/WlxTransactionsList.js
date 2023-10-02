import styles from './WlxTransactionsList.module.scss';
import {useState,useEffect} from 'react'
import axios from 'axios'
import Transaction from './Transaction';
import { Pagination } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
export default function WlxTransactionsList() {
    const [transactions, setTransactions] = useState([])
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [transactionsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const totalFilteredTransactions = transactions.length;
    const totalPageCount = Math.ceil(totalFilteredTransactions / transactionsPerPage);
    const indexOfLastTransactions = currentPage * transactionsPerPage;
    const indexOfFirstTransactions = indexOfLastTransactions - transactionsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstTransactions, indexOfLastTransactions);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    return(
        <div className={styles.transactionsList}>
            <div className={styles.search}>
                <input
                    name='Search'
                    placeholder="Поиск"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {
                    isLoading && (<LinearProgress sx={{width:'75%' }}color='inherit' />)
                }
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
                currentTransactions.map(el=> <Transaction key={el.uuid} setTransactions={setTransactions} transaction={el}/>)
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
                        sx={{fontFamily:"'Nunito',sans-serif",
                        '.MuiPaginationItem-root' : {
                            fontFamily:"'Nunito',sans-serif"
                        }
                    }}
                        />
                    </div>
        </div>
    )
}