import styles from './P2PTransactionsList.module.scss'
import { useEffect, useState } from 'react'
import { Pagination } from '@mui/material';
import $api from '../../axios';
import Iban from './Iban';


export default function IbansList({ibans ,setIbans,setBrands,brands}) {
    const [search, setSearch] = useState('')
    const [ibansPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredIbans, setFilteredIbans] = useState([]);



    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalFilteredIbans = filteredIbans.length;

    useEffect(() => {
        if (ibans) {
            const filtered = ibans.filter(
                (user) => user.IBAN.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredIbans(filtered);
            setCurrentPage(1);
        }
    }, [ibans, search])

    const totalPageCount = Math.ceil(totalFilteredIbans / ibansPerPage);
    const indexOfLastTransaction = currentPage * ibansPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - ibansPerPage;
    const currentIbans = filteredIbans.slice(indexOfFirstTransaction, indexOfLastTransaction);


    useEffect(() => {
        const fetchData = async () => {
            try {
                $api.get('/p2pGetAll').then(res => setIbans(res.data))
            } catch (e) {
                console.log(e)
            }
        }
        fetchData()
    }, [])

    return (
        <div className={styles.transactionsList} style={{marginTop:'20px'}}>
            <div className={styles.search}>
                <input
                    name='Search'
                    placeholder="Поиск реквизитов"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className={styles.header}>
                <h3 style={{ width: '25vw' }}>IBAN</h3>
                <h3 style={{ width: '9.5vw' }}>Бренд</h3>
                <h3 style={{ width: '9.5vw' }}>Страна</h3>
            </div>
            {
                currentIbans.map(el => <Iban key={el.id} iban={el} setIbans={setIbans} brands={brands}/>)
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