import styles from './NowPayTransactionsList.module.scss'
import { useState, useEffect } from 'react'
import { Pagination } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Transaction from './Transaction';
const arrowDownStyle = { width: '17px', transition: 'all 0.3s ease', transform: 'rotate(180deg)', cursor: 'pointer' }
const arrowUpStyle = { width: '17px', transition: 'all 0.3s ease', transform: 'rotate(0deg)', cursor: 'pointer' }


export default function NowPayTransactionsList({ transactions, isLoading, setTransactions }) {

  const [search, setSearch] = useState('')

  const [transactionsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateSort, setDateSort] = useState(null);
  const [amountSort, setAmountSort] = useState(null);
  const [statusSort, setStatusSort] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

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
          return a.status === 'succeeded' ? -1 : 1;
        } else {
          // Сортировка, чтобы 'failed' был первым
          return a.status === 'requires_payment_method' ? -1 : 1;
        }
      });
      setTransactions(sortedTransactions);
      setAmountSort(null);
      setDateSort(null);
    }
  }, [statusSort]);
  useEffect(() => {
    if (dateSort) {
      const sortedTransactions = [...transactions].sort((a, b) => new Date(a.created) - new Date(b.created));
      setTransactions(sortedTransactions);
      setStatusSort(null)
      setAmountSort(null)
    }
    if (dateSort === false) {
      const sortedTransactions = [...transactions].sort((a, b) => new Date(b.created) - new Date(a.created));
      setTransactions(sortedTransactions);
      setStatusSort(null)
      setAmountSort(null)
    }
  }, [dateSort]);
  useEffect(() => {
    if (transactions.length > 0) {
      const filtered = transactions.filter(
        (transaction) => transaction.brand?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredTransactions(filtered);
      setCurrentPage(1);
    }
  }, [transactions, search]);

  const totalFilteredTransactions = filteredTransactions.length;
  const totalPageCount = Math.ceil(totalFilteredTransactions / transactionsPerPage);
  const indexOfLastTransactions = currentPage * transactionsPerPage;
  const indexOfFirstTransactions = indexOfLastTransactions - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransactions, indexOfLastTransactions);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  console.log(transactions);
  return (
    <div className={styles.transactionsList}>
      <div className={styles.search}>
        <input
          name='Search'
          placeholder="Поиск"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {
          isLoading && (<LinearProgress sx={{ width: '75%' }} color='inherit' />)
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
        <h3 style={{ width: '10vw' }}>ID Транзакции</h3>
        <h3 style={{ width: '13.5vw' }}>ФИО</h3>
        <h3 style={{ width: '6vw' }}>Валюта</h3>
        <h3 style={{ width: '7vw' }}>Бренд</h3>
        <h3 className={styles.amount}><span style={{ width: '70%' }}>Введённая сумма</span>
          <ArrowUpwardIcon
            onClick={() => { amountSort ? setAmountSort(!amountSort) : setAmountSort(true) }}
            sx={amountSort ?
              arrowDownStyle
              : arrowUpStyle}
          />
        </h3>
        <h3 className={styles.status}>Статус
          <ArrowUpwardIcon
            onClick={() => { statusSort ? setStatusSort(!statusSort) : setStatusSort(true) }}
            sx={statusSort ?
              arrowDownStyle
              : arrowUpStyle}
          /></h3>

      </div>
      {
        currentTransactions.map(el => <Transaction key={el.id} setTransactions={setTransactions} transaction={el} />)
      }
      <div
        style={{
          width: '97%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 10px 10px 10px',
          margin: '0 auto',
        }}
      >
        <span style={{ color: 'white' }}>Всего транзакций: {filteredTransactions.length}</span>
        <Pagination
          count={totalPageCount}
          color="primary"
          shape="rounded"
          page={currentPage}
          onChange={(event, page) => paginate(page)}
          sx={{
            fontFamily: "'Nunito',sans-serif",
            '.MuiPaginationItem-root': {
              fontFamily: "'Nunito',sans-serif",
              fontWeight: 'bold'
            }
          }}
        />
      </div>
    </div>
  )
}
