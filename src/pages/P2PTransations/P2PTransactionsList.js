import styles from './P2PTransactionsList.module.scss'
import { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import Transaction from './Transaction';

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

export default function P2PTransactionsList() {
    const [search, setSearch] = useState('')
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [brand, setBrand] = useState('')
    const [brandError, setBrandError] = useState('')
    const [login, setLogin] = useState('')
    const [loginError, setLoginError] = useState('')
    const [ibans, setIbans] = useState([])
    const [iban, setIban] = useState('')
    const [amount, setAmount] = useState('')
    const [amountError, setAmountError] = useState('')
    const [ibanError, setIbanError] = useState('')
    const [users, setUsers] = useState([])
    const [value, setValue] = useState(dayjs(''));
    const [dateError, setDateError] = useState('')
    const [transactions , setTransactions] = useState([])
    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        const createdBy = secureLocalStorage.getItem('userId')
        try {
            axios.get('http://localhost:5000/p2pGetAll').then(res => setIbans(res.data))
            axios.post('http://localhost:5000/p2pGetAllTransactions', {createdBy}).then(res => setTransactions(res.data))
            axios.post('http://localhost:5000/users', { createdBy }).then(res => setUsers(res.data.reverse()))

        } catch (e) {
            console.log(e)
        }
    }, [])

    const Create = async () => {
        const createdBy = secureLocalStorage.getItem('userId')
        const status = '0'
        const date = value.format('DD/MM/YYYY HH:mm:ss')
        try {
            const { data } = await axios.post('http://localhost:5000/p2pCreateTransaction', { login, iban, brand, amount, createdBy, date, status })
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
    return (
        <div className={styles.transactionsList}>
            <div className={styles.search}>
                <input
                    name='Search'
                    placeholder="Поиск"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={handleOpen}><AddIcon />Добавить транзакцию</button>
            </div>
            <div className={styles.header}>
                <h3 style={{ width: '11vw' }}>Логин</h3>
                <h3 style={{ width: '140px' }}>Бренд</h3>
                <h3 style={{ width: '20vw' }}>IBAN</h3>
                <h3 style={{ width: '7vw' }}>Сумма</h3>
                <h3 style={{ width: '7vw' }}>Дата</h3>
                <h3 style={{ width: '8.5vw' }}>Статус</h3>
                <h3 style={{ width: '7vw' }}>Загрузить чек</h3>
            </div>
            {
                transactions.map(el=> <Transaction key={el.IBAN} setTransactions={setTransactions} transaction={el}/>)
            }
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
                                    <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Логин</label>
                                    <select value={login} onChange={(e) => { setLogin(e.target.value); setLoginError('') }} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }} placeholder='Бренд'>
                                        <option value="">None</option>
                                        {users.map(el => <option value={el.login} key={el.login}>{el.login} SafeInvest</option>)}
                                    </select>
                                    {
                                        loginError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{loginError}</div>
                                    }
                                </div>

                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Бренд</label>
                                    <select onChange={(e) => { setBrand(e.target.value); setBrandError('') }} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }} placeholder='Бренд'>
                                        <option value="">None</option>
                                        <option value="SafeInvest">SafeInvest</option>
                                        <option value="VetalInvest">VetalInvest</option>
                                        <option value="RiseInvest">RiseInvest</option>
                                        <option value="Revolut">Revolut</option>
                                        <option value="InfinityInvest">InfinityInvest</option>
                                    </select>
                                    {
                                        brandError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{brandError}</div>
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