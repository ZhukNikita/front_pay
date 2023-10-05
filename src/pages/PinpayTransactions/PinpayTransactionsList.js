import styles from './PinpayTransactionsList.module.scss'
import {useState,useEffect} from 'react'
import axios from 'axios'
import { Pagination } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Transaction from './Transaction';
const arrowDownStyle = { width: '17px', transition: 'all 0.3s ease', transform: 'rotate(180deg)', cursor: 'pointer' }
const arrowUpStyle = { width: '17px', transition: 'all 0.3s ease', transform: 'rotate(0deg)', cursor: 'pointer' }
export default function PinpayTransactionsList({transactions,isLoading ,setTransactions}) {

    const [search, setSearch] = useState('')

    const [transactionsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [dateSort, setDateSort] = useState(null);
    const [amountSort, setAmountSort] = useState(null);
    const [statusSort, setStatusSort] = useState(null);

    useEffect(() => {
        if (amountSort) {
            const sortedTransactions = [...transactions].sort((a, b) => b.amount - a.amount);
            setTransactions(sortedTransactions);
            setStatusSort(null)
            setDateSort(null)
        }
        if (amountSort === false) {
            const sortedTransactions = [...transactions].sort((a, b) => a.amount - b.amount);
            setTransactions(sortedTransactions);
            setStatusSort(null)
            setDateSort(null)
        }
    }, [amountSort]);
    useEffect(() => {
        if (statusSort !== null) {
            const sortedTransactions = [...transactions].sort((a, b) => {
                if (statusSort) {
                    // Сортировка, чтобы 'completed' был первым
                    return a.transaction_status === 'completed' ? -1 : 1;
                } else {
                    // Сортировка, чтобы 'failed' был первым
                    return a.transaction_status === 'failed' ? -1 : 1;
                }
            });
            setTransactions(sortedTransactions);
            setAmountSort(null);
            setDateSort(null);
        }
    }, [statusSort]);
    useEffect(() => {
        if (dateSort) {
            const sortedTransactions = [...transactions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setTransactions(sortedTransactions);
            setStatusSort(null)
            setAmountSort(null)
        }
        if (dateSort === false) {
            const sortedTransactions = [...transactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTransactions(sortedTransactions);
            setStatusSort(null)
            setAmountSort(null)
        }
    }, [dateSort]);

    const totalFilteredTransactions = transactions.length;
    const totalPageCount = Math.ceil(totalFilteredTransactions / transactionsPerPage);
    const indexOfLastTransactions = currentPage * transactionsPerPage;
    const indexOfFirstTransactions = indexOfLastTransactions - transactionsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstTransactions, indexOfLastTransactions);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                <h3 style={{ width: '9vw' }}>ID Транзакции</h3>
                <h3 style={{ width: '13.5vw' }}>Email</h3>
                <h3 style={{ width: '7vw' }}>Валюта</h3>
                <h3 style={{ width: '10vw' }}>Бренд</h3>
                <h3 className={styles.amount}><span style={{width:'70%'}}>Введённая сумма</span>
                <ArrowUpwardIcon
                    onClick={() => { amountSort ? setAmountSort(!amountSort) : setAmountSort(true) }}
                    sx={amountSort ?
                    arrowDownStyle
                    : arrowUpStyle}
                />
                </h3>
                <h3 style={{ width: '10vw' }}>Номер карты</h3>
                <h3 style={{ width: '7vw' }}>Статус</h3>
                <ArrowUpwardIcon
                    onClick={() => { statusSort ? setStatusSort(!statusSort) : setStatusSort(true) }}
                    sx={statusSort ?
                    arrowDownStyle
                    : arrowUpStyle}
                />
            </div>
            {
                currentTransactions.map(el=> <Transaction key={el.payment_id} setTransactions={setTransactions} transaction={el}/>)
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
                            fontFamily:"'Nunito',sans-serif",
                            fontWeight:'bold'
                        }
                    }}
                        />
                    </div>
        </div>
    )
}
