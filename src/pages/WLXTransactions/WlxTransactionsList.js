import styles from './WlxTransactionsList.module.scss';
import {useState,useEffect} from 'react'
import axios from 'axios'
import Transaction from './Transaction';
import { Pagination } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const arrowDownStyle = { width: '17px', transition: 'all 0.3s ease', transform: 'rotate(180deg)', cursor: 'pointer' }
const arrowUpStyle = { width: '17px', transition: 'all 0.3s ease', transform: 'rotate(0deg)', cursor: 'pointer' }
export default function WlxTransactionsList() {
    const [transactions, setTransactions] = useState([])
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [transactionsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [dateSort, setDateSort] = useState(null);
    const [amountSort, setAmountSort] = useState(null);
    useEffect(() => {
        if (amountSort) {
            const sortedTransactions = [...transactions].sort((a, b) => b.entered_amount - a.entered_amount);
            setTransactions(sortedTransactions);
            setDateSort(null)
        }
        if (amountSort === false) {
            const sortedTransactions = [...transactions].sort((a, b) => a.entered_amount - b.entered_amount);
            setTransactions(sortedTransactions);
            setDateSort(null)
        }
    }, [amountSort]);

    useEffect(() => {
        if (dateSort) {
            const sortedTransactions = [...transactions].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            setTransactions(sortedTransactions);
            setAmountSort(null)
        }
        if (dateSort === false) {
            const sortedTransactions = [...transactions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setTransactions(sortedTransactions);
            setAmountSort(null)
        }
    }, [dateSort]);

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
                <h3 className={styles.date}>Дата
                <ArrowUpwardIcon
                    onClick={() => { dateSort ? setDateSort(!dateSort) : setDateSort(true) }}
                    sx={dateSort ?
                    arrowDownStyle
                    : arrowUpStyle}
                />
                </h3>
                <h3 style={{ width: '160px' }}>ID Транзакции</h3>
                <h3 style={{ width: '7vw' }}>Валюта</h3>
                <h3 style={{ width: '10vw' }}>Пользователь</h3>
                <h3 className={styles.amount}><span style={{width:'70%'}}>Введённая сумма</span>
                <ArrowUpwardIcon
                    onClick={() => { amountSort ? setAmountSort(!amountSort) : setAmountSort(true) }}
                    sx={amountSort ?
                    arrowDownStyle
                    : arrowUpStyle}
                />
                </h3>
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