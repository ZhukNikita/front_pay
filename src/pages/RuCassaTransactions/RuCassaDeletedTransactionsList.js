import styles from './RuCassaTransactionsList.module.scss'
import { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage';
import DeletedTransaction from './DeletedTransaction';
import { Pagination } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import $api from '../../axios';

const arrowDownStyle = { width: '17px', transition: 'all 0.3s ease', transform: 'rotate(180deg)', cursor: 'pointer' }
const arrowUpStyle = { width: '17px', transition: 'all 0.3s ease', transform: 'rotate(0deg)', cursor: 'pointer' }

export default function RuCassaDeletedTransactionsList() {
    const [search, setSearch] = useState('')
    const [transactions , setTransactions] = useState([])
    const [transactonsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [dateSort, setDateSort] = useState(null);
    const [deletedDateSort, setDeletedDateSort] = useState(null);
    const [amountSort, setAmountSort] = useState(null);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalFilteredTransactions = filteredTransactions.length;
    const [loginSort, setLoginSort] = useState(null)

    useEffect(() => {
      if (loginSort) {
        const sortedTransactions = [...transactions].sort((a, b) => a.login.localeCompare(b.login));
        setTransactions(sortedTransactions);
        setDateSort(null)
        setDeletedDateSort(null)
        setAmountSort(null)
      }
      if (loginSort === false) {
        const sortedTransactions = [...transactions].sort((a, b) => b.login.localeCompare(a.login));
        setTransactions(sortedTransactions);
        setDateSort(null)
        setDeletedDateSort(null)
        setAmountSort(null)
      }
    }, [loginSort]);
    useEffect(() => {
        if (amountSort) {
          const sortedTransactions = [...transactions].sort((a, b) => b.amount - a.amount);
          setTransactions(sortedTransactions);
          setDateSort(null)
          setDeletedDateSort(null)
          setLoginSort(null)
        }
        if (amountSort === false) {
          const sortedTransactions = [...transactions].sort((a, b) => a.amount - b.amount);
          setTransactions(sortedTransactions);
          setDateSort(null)
          setDeletedDateSort(null)
          setLoginSort(null)
        }
      }, [amountSort]);

    useEffect(() => {
        if (dateSort) {
          const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
          setTransactions(sortedTransactions);
          setAmountSort(null)
          setDeletedDateSort(null)
          setLoginSort(null)

        }
        if (dateSort === false) {
          const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
          setTransactions(sortedTransactions);
          setAmountSort(null)
          setDeletedDateSort(null)
          setLoginSort(null)

        }
      }, [dateSort]);

      useEffect(() => {
        if (deletedDateSort) {
          const sortedTransactions = [...transactions].sort((a, b) => new Date(b.deleteTime) - new Date(a.deleteTime));
          setTransactions(sortedTransactions);
          setAmountSort(null)
          setDateSort(null)
          setLoginSort(null)

        }
        if (deletedDateSort === false) {
          const sortedTransactions = [...transactions].sort((a, b) => new Date(a.deleteTime) - new Date(b.deleteTime));
          setTransactions(sortedTransactions);
          setAmountSort(null)
          setDateSort(null)
          setLoginSort(null)
        }
      }, [deletedDateSort]);

    useEffect(() => {
        if (transactions) {
          const filtered = transactions.filter(
            (user) => user.login.toLowerCase().includes(search.toLowerCase())
          );
          setFilteredTransactions(filtered);
          setCurrentPage(1);
        }
      }, [transactions, search])

    const totalPageCount = Math.ceil(totalFilteredTransactions / transactonsPerPage);
    const indexOfLastTransaction = currentPage * transactonsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactonsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

    useEffect(() => {
        if (transactions) {
          const filtered = transactions.filter(
            (user) => user.login.toLowerCase().includes(search.toLowerCase())
          );
          setFilteredTransactions(filtered);
          setCurrentPage(1);
        }
      }, [transactions, search])

    useEffect(() => {
        const createdBy = secureLocalStorage.getItem('userId')
        const fetchData = async()=>{
            try {
                $api.post('/p2pGetAllDeletedTransactions', {createdBy}).then(res => setTransactions(res.data))
    
            } catch (e) {
                console.log(e)
            }
        }
        fetchData()
    }, [])

    return (
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
                <h3 className={styles.login}>Логин
                <ArrowUpwardIcon
                    onClick={() => { loginSort ? setLoginSort(!loginSort) : setLoginSort(true)}}
                    sx={loginSort ?
                    arrowDownStyle
                    : arrowUpStyle}
                />
                </h3>
                <h3 style={{ width: '9.5vw' }}>Бренд</h3>
                <h3 style={{ width: '16vw' }}>IBAN</h3>
                <h3 className={styles.amount}>Сумма
                <ArrowUpwardIcon
                    onClick={() => { amountSort ? setAmountSort(!amountSort) : setAmountSort(true) }}
                    sx={amountSort ?
                    arrowDownStyle
                    : arrowUpStyle}
                />
                </h3>
                <h3 className={styles.date}><span style={{width:'65%'}}>Дата Создания</span>
                <ArrowUpwardIcon
                    onClick={() => { dateSort ? setDateSort(!dateSort) : setDateSort(true) }}
                    sx={dateSort ?
                    arrowDownStyle
                    : arrowUpStyle}
                />
                </h3>
                <h3 className={styles.date}><span style={{width:'65%'}}>Дата Удаления</span>
                <ArrowUpwardIcon
                    onClick={() => { deletedDateSort ? setDeletedDateSort(!deletedDateSort) : setDeletedDateSort(true) }}
                    sx={deletedDateSort ?
                    arrowDownStyle
                    : arrowUpStyle}
                />
                </h3>
                <h3 style={{ width: '8.6vw' }}>Статус</h3>
            </div>
            {
                currentTransactions.map(el=> <DeletedTransaction key={el.id} setTransactions={setTransactions} transaction={el}/>)
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