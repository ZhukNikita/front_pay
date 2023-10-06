import styles from './InsirexTransactionsList.module.scss'
import {useState,useEffect} from 'react'
import Transaction from './Transaction';
import { Pagination } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import secureLocalStorage from 'react-secure-storage';
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
export default function InsirexTransactionsList() {
    const [transactions, setTransactions] = useState([])
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [transactionsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [dateSort, setDateSort] = useState(null);
    const [amountSort, setAmountSort] = useState(null);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(dayjs(new Date()));
    const [dateError, setDateError] = useState('');
    const [brand ,setBrand] = useState('');
    const [brandError , setBrandError] = useState('');
    const [login , setLogin] = useState('')
    const [loginError , setLoginError] = useState('')
    const [usersByBrand, setUsersByBrand] = useState([])
    const [amount, setAmount] = useState('')
    const [amountError, setAmountError] = useState('');
    const [users, setUsers] = useState([])
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [fullName ,setFullName] = useState('')
    const [fullNameError ,setFullNameError] = useState('')
    const handleOpen = () => setOpen(true);
    const totalFilteredTransactions = transactions.length;
    const totalPageCount = Math.ceil(totalFilteredTransactions / transactionsPerPage);
    const indexOfLastTransactions = currentPage * transactionsPerPage;
    const indexOfFirstTransactions = indexOfLastTransactions - transactionsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstTransactions, indexOfLastTransactions);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const ChangeUsersByBrand = (e) => {
        setBrand(e.target.value);
    }

    useEffect(() => {
        const userToken = secureLocalStorage.getItem('userToken')
        const createdBy = secureLocalStorage.getItem('userId')
        const fetchData = async () => {
            try {
                $api.post('/insirexGetAllTransactions', {createdBy}).then(res => setTransactions(res.data))
                $api.post('/users', { userToken }).then(res => setUsers(res.data.reverse()))
            } catch (e) {
                console.log(e)
            }
        }
        fetchData()
    }, [])

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
        setUsersByBrand(users.filter(el => el.brand === brand))
    }, [brand])

    const handleClose = () => {
        setOpen(false);
        setAmountError('')
        setBrandError('')
        setDateError('')
        setValue(dayjs(new Date()))
        setLoginError('')
        setAmount('')
        setLogin('')
        setBrand('')
        setAmount('')
        setFullName('')
        setFullNameError('')
    };
    const Create = async () => {
        const createdBy = secureLocalStorage.getItem('userId')
        const status = '0'
        const date = value.format('DD/MM/YYYY HH:mm:ss')
        try {

            const { data } = await $api.post('/insirexCreateTransaction', { login, fullName, brand, amount, createdBy, date, status })
            await $api.post('/insirexGetAllTransactions', { createdBy }).then(res => setTransactions(res.data))
            return data
        } catch (e) {
            console.log(e)
        } finally {
            handleClose()
        }
    }
    const Check = () => {
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
                <button onClick={handleOpen}><AddIcon />Добавить транзакцию</button>

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
                <h3 style={{ width: '11vw' }}>Логин</h3>
                <h3 style={{ width: '9.5vw' }}>Бренд</h3>

                <h3 style={{ width: '12vw' }}>ФИО пользователя</h3>
                <h3 className={styles.amount}>Сумма
                <ArrowUpwardIcon
                    onClick={() => { amountSort ? setAmountSort(!amountSort) : setAmountSort(true) }}
                    sx={amountSort ?
                    arrowDownStyle
                    : arrowUpStyle}
                />
                </h3>
                <h3 style={{ width: 'calc(9.5vw + 10px)' }}>Статус</h3>
            </div>
            {
                currentTransactions.map(el=> <Transaction key={el.id} setTransactions={setTransactions} transaction={el}/>)
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
                            <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>ФИО Отправителя</label>
                            <input
                                        name='amount'
                                        onChange={(e) => { setFullName(e.target.value); setFullNameError('') }}
                                        type="text"
                                        style={{ outline: 'none', padding: '16px 20px', appearance: 'none', margin: '0', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px' }}
                                        placeholder='Полное имя' />
                            {/* */}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', width: '100%' }}>
                            <div style={{ width: '47%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Бренд</label>
                                    <select onChange={(e) => { ChangeUsersByBrand(e); setBrandError('') }} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }} placeholder='Бренд'>
                                        <option value="">None</option>
                                        <option value="SafeInvest">SafeInvest</option>
                                        <option value="VitalInvest">VitalInvest</option>
                                        <option value="RiseInvest">RiseInvest</option>
                                        <option value="Revolut">Revolut</option>
                                        <option value="InfinityInvest">InfinityInvest</option>
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
                                                        fontFamily:'"Nunito",sans-serif'
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
                                && !amountError
                                && !brandError
                                && !dateError
                                && !fullNameError
                                && brand
                                && value
                                && amount
                                && login
                                && fullName
                                ? <button onClick={Create} style={{ padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', color: 'white', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', backgroundColor: '#38b6ff', cursor: 'pointer' }}>Создать</button>
                                : <button onClick={Check} style={{ padding: '15px 20px', color: 'white', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', background: 'none', cursor: 'pointer' }}>Создать</button>
                        }
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}