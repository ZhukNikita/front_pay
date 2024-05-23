import styles from './P2PTransactionsList.module.scss'
import { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import secureLocalStorage from 'react-secure-storage';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import Transaction from './Transaction';
import { Pagination } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import $api from '../../axios';

const arrowDownStyle = { width: '17px', transition: 'all 0.3s ease', transform: 'rotate(180deg)', cursor: 'pointer' }
const arrowUpStyle = { width: '17px', transition: 'all 0.3s ease', transform: 'rotate(0deg)', cursor: 'pointer' }

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '15px',
    backgroundColor: '#233e68',
    width: "550px"
};

export default function P2PTransactionsList({ibans ,setIbans,setBrands,brands}) {
    const [search, setSearch] = useState('')
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [brand, setBrand] = useState('')
    const [brandError, setBrandError] = useState('')
    const [login, setLogin] = useState('')
    const [loginError, setLoginError] = useState('')
    const [iban, setIban] = useState('')
    const [amount, setAmount] = useState('')
    const [amountError, setAmountError] = useState('')
    const [ibanError, setIbanError] = useState('')
    const [users, setUsers] = useState([])
    const [value, setValue] = useState(dayjs(''));
    const [dateError, setDateError] = useState('')
    const [transactions, setTransactions] = useState([])
    const [transactonsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [dateSort, setDateSort] = useState(null);
    const [amountSort, setAmountSort] = useState(null);
    const [loginSort, setLoginSort] = useState(null)
    useEffect(() => {
        if (loginSort) {
            const sortedTransactions = [...transactions].sort((a, b) => a.login.localeCompare(b.login));
            setTransactions(sortedTransactions);
            setDateSort(null)
            setAmountSort(null)
        }
        if (loginSort === false) {
            const sortedTransactions = [...transactions].sort((a, b) => b.login.localeCompare(a.login));
            setTransactions(sortedTransactions);
            setDateSort(null)
            setAmountSort(null)
        }
    }, [loginSort]);
    useEffect(() => {
        if (amountSort) {
            const sortedTransactions = [...transactions].sort((a, b) => b.amount - a.amount);
            setTransactions(sortedTransactions);
            setDateSort(null)
            setLoginSort(null)
        }
        if (amountSort === false) {
            const sortedTransactions = [...transactions].sort((a, b) => a.amount - b.amount);
            setTransactions(sortedTransactions);
            setDateSort(null)
            setLoginSort(null)
        }
    }, [amountSort]);

    useEffect(() => {
        if (dateSort) {
            const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
            setTransactions(sortedTransactions);
            setAmountSort(null)
            setLoginSort(null)

        }
        if (dateSort === false) {
            const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
            setTransactions(sortedTransactions);
            setAmountSort(null)
            setLoginSort(null)

        }
    }, [dateSort]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalFilteredTransactions = filteredTransactions.length;

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
    const [usersByBrand, setUsersByBrand] = useState([])

    const handleClose = () => {
        setOpen(false);
        setAmountError('')
        setBrandError('')
        setDateError('')
        setLoginError('')
        setAmount('')
        setLogin('')
        setBrand('')
        setAmount('')
        setIbanError('')
        setIban('')
    };

    useEffect(() => {
        const userToken = secureLocalStorage.getItem('userToken')
        const createdBy = secureLocalStorage.getItem('userId')
        const fetchData = async () => {
            try {
                $api.get('/p2pGetAll').then(res => setIbans(res.data))
                $api.post('/getBrands' , {createdBy}).then(res => setBrands(res.data))
                $api.post('/p2pGetAllTransactions', {createdBy}).then(res => setTransactions(res.data))
                $api.post('/users', { userToken }).then(res => setUsers(res.data.reverse()))
            } catch (e) {
                console.log(e)
            }
        }
        fetchData()
    }, [])
    const Create = async () => {
        const createdBy = secureLocalStorage.getItem('userId')
        const status = '0'
        const date = value.format('DD/MM/YYYY HH:mm:ss')
        try {

            const { data } = await $api.post('/p2pCreateTransaction', { login, iban, brand, amount, createdBy, date, status })
            await $api.post('/p2pGetAllTransactions', { createdBy }).then(res => setTransactions(res.data))

            return data
        } catch (e) {
            console.log(e)
        } finally {
            handleClose()
        }
    }
    const Check = () => {
        if (iban === '') {
            setIbanError('Выберите IBAN!')
        }
        if (login === '') {
            setLoginError('Выберите Логин пользователя!')
        }
        if (brand === '') {
            setBrandError('Выберите бренд!')
        }
        if (amount === '') {
            setAmountError('Введите сумму платежа!')
        }
        if (amount <= 0) {
            setAmountError('Некоректная сумма платежа!')
        }
        if (isNaN(new Date(value).getTime())) {
            setDateError('Выберите дату!')
        }
    }
    const ChangeUsersByBrand = (e) => {
        setBrand(e.target.value);
    }
    useEffect(() => {
        setUsersByBrand(users.filter(el => el.brand === brand))
    }, [brand])
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
                    secureLocalStorage.getItem('role') === 'SuperAdmin'?
                    <button onClick={handleOpen}><AddIcon />Добавить транзакцию</button>
                    :''
                }
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
                <h3 style={{ width: '10vw' }}>Id Транзакции</h3>

                <h3 style={{ width: '9.5vw' }}>Бренд</h3>
                <h3 style={{ width: '16vw' }}>IBAN</h3>
                <h3 className={styles.amount}>Сумма
                <ArrowUpwardIcon
                    onClick={() => { amountSort ? setAmountSort(!amountSort) : setAmountSort(true) }}
                    sx={amountSort ?
                    arrowDownStyle
                    : arrowUpStyle}
                /></h3>
                <h3  className={styles.date} style={{gap:'10px'}}>Дата
                <ArrowUpwardIcon
                    onClick={() => { dateSort ? setDateSort(!dateSort) : setDateSort(true) }}
                    sx={dateSort ?
                    arrowDownStyle
                    : arrowUpStyle}
                />
                </h3>
                <h3 style={{ width: '8.6vw' }}>Статус</h3>
            </div>
            {
                currentTransactions.map(el => <Transaction key={el.id} setTransactions={setTransactions} transaction={el} />)
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
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <h2 style={{ color: 'white', width: '100%', textAlign: 'center', fontFamily: "'Nunito',sans-serif" }}>Создание платежа</h2>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>IBAN</label>
                            <select value={iban} onChange={(e) => { setIban(e.target.value); setIbanError('') }} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }} placeholder='Бренд'>
                                <option value="">None</option>
                                {ibans.map(el => <option style={{ width: '300px', wordBreak: 'break-all' }} value={el.IBAN} key={el.IBAN}>{el.IBAN}</option>)}
                            </select>
                            {
                                ibanError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{ibanError}</div>
                            }
                        </div>
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', width: '100%' }}>
                            <div style={{ width: '47%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Бренд</label>
                                    <select onChange={(e) => { ChangeUsersByBrand(e); setBrandError('') }} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }} placeholder='Бренд'>
                                        <option value="">None</option>
                                        {brands && (brands.map(el=> <option key={el.id} value={el.brand}>{el.brand}</option>))}
                                    </select>
                                    {
                                        brandError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{brandError}</div>
                                    }
                                </div>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Логин</label>
                                    <select value={login} onChange={(e) => { setLogin(e.target.value); setLoginError('') }} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }} placeholder='Бренд'>
                                        <option value="">None</option>
                                        {usersByBrand.map(el => <option value={el.login} key={el.login}>{el.login}</option>)}
                                    </select>
                                    {
                                        loginError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{loginError}</div>
                                    }
                                </div>
                            </div>
                            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Дата платежа</label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']} sx={{ padding: 0, border: 'none' }}>
                                            <DateTimePicker
                                                sx={
                                                    {
                                                        backgroundColor: 'white',
                                                        paddingTop: '0px',
                                                        borderRadius: '8px',
                                                    }
                                                }
                                                viewRenderers={{
                                                    hours: renderTimeViewClock,
                                                    minutes: renderTimeViewClock,
                                                    seconds: renderTimeViewClock,
                                                }}
                                                value={value}
                                                onChange={(newValue) => { setValue(newValue); setDateError('') }}
                                                inputFormat="dd/MM/yyyy HH:mm"
                                                ampm={false}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                    {
                                        dateError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{dateError}</div>
                                    }
                                </div>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Сумма платежа</label>
                                    <input
                                        name='amount'
                                        onChange={(e) => { setAmount(e.target.value); setAmountError('') }}
                                        type="number"
                                        style={{ outline: 'none', padding: '16px 20px', appearance: 'none', margin: '0', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px' }}
                                        placeholder='Сумма' />
                                    {
                                        amountError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{amountError}</div>
                                    }
                                </div>
                            </div>
                        </div>

                        {
                            !loginError
                                && !ibanError
                                && !amountError
                                && !brandError
                                && !dateError
                                && brand
                                && value
                                && amount
                                && login
                                && iban
                                ? <button onClick={Create} style={{ padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', color: 'white', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', backgroundColor: '#38b6ff', cursor: 'pointer' }}>Создать</button>
                                : <button onClick={Check} style={{ padding: '15px 20px', color: 'white', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', background: 'none', cursor: 'pointer' }}>Создать</button>
                        }
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}