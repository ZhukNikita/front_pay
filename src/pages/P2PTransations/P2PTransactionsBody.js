import React, { useState } from 'react'
import styles from './P2PTransactionsBody.module.scss'
import P2PTransactionsList from './P2PTransactionsList'
import secureLocalStorage from 'react-secure-storage'
import { Link } from 'react-router-dom'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import WarningIcon from '@mui/icons-material/Warning';
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import $api from '../../axios'
import BlockIcon from '@mui/icons-material/Block';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import utc from 'dayjs/plugin/utc'
import { DateTimePicker } from '@mui/x-date-pickers'
import moment from 'moment/moment'
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
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
    width: "400px"
};
const inputStyle = { outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '140px' }
export default function P2PTransactionsBody() {
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openEditIban, setOpenEditIban] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleOpenEditIban = () => setOpenEditIban(true);
    const [iban1, setIban] = useState('')
    const [ibanToDelete, setIbanToDelete] = useState('')
    const [ibanError, setIbanError] = useState('')
    const [ibanErrorToDelete, setIbanErrorToDelete] = useState('')
    const [recipient, setRecipient] = useState('')
    const [recipientError, setRecipientError] = useState('')
    const [bank, setBank] = useState('')
    const [bankError, setBankError] = useState('')
    const [bic, setBic] = useState('')
    const [country, setCountry] = useState('')
    const [countryCode, setCountryCode] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [bicError, setBicError] = useState('')
    const [ibans, setIbans] = useState([])
    const [snack, setSnack] = useState(false);
    const [limit, setLimit] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [snackType, setSnackType] = useState('');
    const [period, setPeriod] = useState()
    dayjs.extend(utc)
    const handleClose = () => {
        setOpen(false);
        setIban('');
        setRecipient('');
        setBank('');
        setBic('');
        setCountry('')
        setCountryCode('')
        setAccountNumber('')
    };
    const handleDeleteClose = () => {
        setOpenDelete(false);
        setIbanToDelete('');
    };
    const handleEditClose = () => {
        setOpenEdit(false);
        setIbanToDelete('');
        setLimit(false)
        setPeriod()
    };
    const handleEditIbanClose = () => {
        setOpenEditIban(false);
        setIbanToDelete('');
        setLimit(false)
    };
    const CheckToDelete = () => {
        if (!ibanToDelete) {
            setIbanErrorToDelete('Выберите IBAN для удаления')
        }
    }
    const CheckToEdit = () => {
        if (!ibanToDelete) {
            setIbanErrorToDelete('Выберите IBAN для изменения')
        }
    }
    const Check = () => {
        if (!iban1) {
            setIbanError('Введите IBAN')
        }
        if (!recipient) {
            setRecipientError('Введите получателя')
        }
        if (!bank) {
            setBankError('Введите банк получателя')
        }
    }

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackMessage('')
        setSnack(false);
    };
    const SetLimit = async () => {
        if (!period) {
            setSnack(true)
            setSnackType('error')
            setSnackMessage('Не выбрано время спама!')
            return

        }
        if (dayjs(period).utc() < dayjs(new Date(Date.now())).utc()) {
            setSnack(true)
            setSnackType('error')
            setSnackMessage('Время не может быть меньше текущего!')
            return
        }
        try {
            const { data } = await $api.post('/setIbanLimit', { iban: ibanToDelete, limit: limit ? '1' : '0', period: dayjs(period).utc().format('YYYY-MM-DD HH:mm') })
            if (data) {
                setSnack(true)
                setSnackType('success')
                setSnackMessage('IBAN успешно изменён!')
                await $api.get('/p2pGetAll').then(res => setIbans(res.data))
            }
        } catch (e) {
            console.log(e)
        } finally {
            handleEditClose()
        }
    }
    const unBan = async () => {
        try {
            const { data } = await $api.post('/unBanIban', { iban: ibanToDelete })
            if (data) {
                setSnack(true)
                setSnackType('success')
                setSnackMessage('IBAN успешно изменён!')
                await $api.get('/p2pGetAll').then(res => setIbans(res.data))

            }
        } catch (e) {
            console.log(e)
        } finally {
            handleEditIbanClose()
        }
    }
    const Create = async () => {
        const createdBy = secureLocalStorage.getItem('userId')
        const iban = iban1.replace(/\s/g, "")
        try {
            const { data } = await $api.post('/createIban', { iban, recipient, bank, bic, country, countryCode, accountNumber, createdBy })
            await $api.get('/p2pGetAll').then(res => setIbans(res.data))
            setSnack(true)
            setSnackType('success')
            setSnackMessage('IBAN успешно создан')
            return data
        } catch (e) {
            console.log(e)
            setSnack(true)
            setSnackType('error')
            setSnackMessage(e.response.data.message.status)
        }
        finally {
            handleClose()
        }
    }
    const Delete = async () => {
        const createdBy = secureLocalStorage.getItem('userId')
        try {
            const { data } = await $api.post('/deleteIban', { ibanToDelete, createdBy })
            await $api.get('/p2pGetAll').then(res => setIbans(res.data))
            setSnack(true)
            setSnackType('success')
            setSnackMessage('IBAN успешно удалён')
            return data
        } catch (e) {
            console.log(e)
            setSnack(true)
            setSnackType('error')
            setSnackMessage(e.response.data.message.status)
        }
        finally {
            handleDeleteClose()
        }
    }
    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <h1>Транзакции P2P</h1>
                <div className={styles.buttons}>
                    {
                        secureLocalStorage.getItem('role') === 'SuperAdmin' ?
                            <>
                                <button onClick={handleOpenEdit}><BlockIcon />Внести в спам</button>
                                <button onClick={handleOpenEditIban}><CheckCircleRoundedIcon />Убрать из спама</button>
                                <button onClick={handleOpen}><AccountBalanceIcon />Добавить IBAN</button>
                                <button onClick={handleOpenDelete} style={{ backgroundColor: '#ad2824', color: '#ffa6b2' }}><DeleteOutlineIcon />Удалить IBAN</button>

                                <Link to={'/p2p-deleted-transactions'} className={styles.deletedTransactions}>Удаленные транзакции</Link>
                            </>

                            : <></>
                    }
                </div>

            </div>
            <P2PTransactionsList ibans={ibans} setIbans={setIbans} />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h2 style={{ fontFamily: "'Nunito',sans-serif", color: 'rgb(183, 220, 233)', marginTop: '0' }}>Добавить IBAN</h2>
                    <div style={{ width: '100%' }}>
                        <label style={{ marginBottom: '0', width: '100%', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', color: 'rgb(183, 220, 233)' }}>IBAN</label>
                        <input onChange={(e) => { setIban(e.target.value); setIbanError('') }} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '90%' }} placeholder='Введите IBAN' />
                        {
                            ibanError ? <p style={{ margin: '0 0 0 5px', color: 'red', fontFamily: '"Nunito"  ,sans-serif', fontWeight: 'bold' }}>{ibanError}</p> : ''
                        }
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'start', gap: '60px' }}>
                        <div style={{ width: '40%', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ marginBottom: '0', width: '100%', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', color: 'rgb(183, 220, 233)' }}>Получатель</label>
                            <input onChange={(e) => { setRecipient(e.target.value); setRecipientError('') }} style={inputStyle} placeholder='Получатель' />
                            {
                                recipientError ? <p style={{ width: '100%', margin: '0 0 0 5px', color: 'red', fontFamily: '"Nunito"  ,sans-serif', fontWeight: 'bold' }}>{recipientError}</p> : ''
                            }
                        </div>
                        <div style={{ width: '40%', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ marginBottom: '0', width: '100%', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', color: 'rgb(183, 220, 233)' }}>Банк</label>
                            <input onChange={(e) => { setBank(e.target.value); setBankError('') }} style={inputStyle} placeholder='Банк' />
                            {
                                bankError ? <p style={{ width: '182px', margin: '0 0 0 5px', color: 'red', fontFamily: '"Nunito"  ,sans-serif', fontWeight: 'bold' }}>{bankError}</p> : ''
                            }
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'start', gap: '60px' }}>
                        <div style={{ width: '40%', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ marginBottom: '0', width: '100%', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', color: 'rgb(183, 220, 233)' }}>BIC Банка</label>
                            <input onChange={(e) => { setBic(e.target.value); setBicError('') }} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '90%' }} placeholder='BIC Банка' />
                            {/* {
                                bicError? <p style={{width:'182px' , margin:'0 0 0 5px', color:'red', fontFamily: '"Nunito"  ,sans-serif', fontWeight:'bold'}}>{bicError}</p> : ''
                            } */}
                        </div>
                        <div style={{ backgroundColor: 'white', width: '46%', borderRadius: '7px' }}>
                            <div style={{ backgroundColor: 'rgba(255, 237, 193, 0.5)', width: 'calc(100% - 2px)', borderRadius: '8px', border: '1px solid #FFECA1', height: 'calc(100% - 2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <WarningIcon sx={{ color: '#D18E00', marginLeft: '10px' }} />
                                <p style={{ fontSize: '13px', fontFamily: "'Nunito',sans-serif", fontWeight: '600', marginRight: '10px', color: '#D18E00' }}>Перед созданием, пожалуйста, убедитесь в правильности всех введенных данных!</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'start', gap: '60px' }}>
                        <div style={{ width: '40%', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ marginBottom: '0', width: '100%', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', color: 'rgb(183, 220, 233)' }}>Номер счёта</label>
                            <input onChange={(e) => { setAccountNumber(e.target.value) }} style={inputStyle} placeholder='Номер счёта' />
                            {/* {
                                recipientError? <p style={{width:'100%' , margin:'0 0 0 5px', color:'red', fontFamily: '"Nunito"  ,sans-serif', fontWeight:'bold'}}>{recipientError}</p> : ''
                            } */}
                        </div>
                        <div style={{ width: '40%', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ marginBottom: '0', width: '100%', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', color: 'rgb(183, 220, 233)' }}>Код страны</label>
                            <input onChange={(e) => { setCountryCode(e.target.value) }} style={inputStyle} placeholder='Код страны' />
                            {/* {
                                bankError? <p style={{width:'182px' , margin:'0 0 0 5px', color:'red', fontFamily: '"Nunito"  ,sans-serif', fontWeight:'bold'}}>{bankError}</p> : ''
                            } */}
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'start', gap: '60px' }}>
                        <div style={{ width: '40%', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ marginBottom: '0', width: '100%', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', color: 'rgb(183, 220, 233)' }}>Страна</label>
                            <input onChange={(e) => { setCountry(e.target.value) }} style={inputStyle} placeholder='Страна' />
                            {/* {
                                recipientError? <p style={{width:'100%' , margin:'0 0 0 5px', color:'red', fontFamily: '"Nunito"  ,sans-serif', fontWeight:'bold'}}>{recipientError}</p> : ''
                            } */}
                        </div>
                    </div>
                    <div>
                        {
                            iban1 && recipient && bank
                                ? <button
                                    onClick={Create}
                                    style={{
                                        border: 'none',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgb(56, 182, 255)',
                                        fontFamily: "'Nunito',sans-serif",
                                        fontWeight: '600',
                                        color: 'white',
                                        fontSize: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        cursor: 'pointer'
                                    }}>
                                    <AddIcon />Добавить
                                </button>
                                : <button
                                    onClick={Check}
                                    style={{
                                        border: '1px solid rgb(56, 182, 255)',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        background: 'none',
                                        fontFamily: "'Nunito',sans-serif",
                                        fontWeight: '600',
                                        color: 'white',
                                        fontSize: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        cursor: 'pointer'
                                    }}>
                                    <AddIcon />Добавить
                                </button>
                        }

                    </div>
                </Box>
            </Modal>
            <Modal
                open={openDelete}
                onClose={handleDeleteClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h2 style={{ fontFamily: "'Nunito',sans-serif", color: 'rgb(183, 220, 233)', marginTop: '0' }}>Удалить IBAN</h2>
                    <div style={{ width: '100%' }}>
                        <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>IBAN</label>
                        <select value={ibanToDelete} onChange={(e) => { setIbanToDelete(e.target.value); setIbanErrorToDelete('') }} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }} placeholder='Бренд'>
                            <option value="">None</option>
                            {ibans.map(el => <option style={{ width: '300px', wordBreak: 'break-all' }} value={el.IBAN} key={el.IBAN}>{el.IBAN}</option>)}
                        </select>
                        {
                            ibanErrorToDelete && <p style={{ color: 'red', fontSize: '16px', margin: '0 0 0 5px', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{ibanErrorToDelete}</p>
                        }
                    </div>
                    <div>
                        {
                            ibanToDelete
                                ? <button
                                    onClick={Delete}
                                    style={{
                                        border: 'none',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgb(56, 182, 255)',
                                        fontFamily: "'Nunito',sans-serif",
                                        fontWeight: '600',
                                        color: 'white',
                                        fontSize: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        cursor: 'pointer'
                                    }}>
                                    <DeleteOutlineIcon />Удалить
                                </button>
                                : <button
                                    onClick={CheckToDelete}
                                    style={{
                                        border: '1px solid rgb(56, 182, 255)',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        background: 'none',
                                        fontFamily: "'Nunito',sans-serif",
                                        fontWeight: '600',
                                        color: 'white',
                                        fontSize: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        cursor: 'pointer'
                                    }}>
                                    <DeleteOutlineIcon />Удалить
                                </button>
                        }

                    </div>
                </Box>
            </Modal>
            <Modal
                open={openEdit}
                onClose={handleEditClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h2 style={{ fontFamily: "'Nunito',sans-serif", color: 'rgb(183, 220, 233)', marginTop: '0' }}>Изменить IBAN</h2>
                    <div style={{ width: '100%' }}>
                        <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>IBAN</label>
                        <select value={ibanToDelete} onChange={(e) => { setIbanToDelete(e.target.value); setIbanErrorToDelete('') }} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }} placeholder='Бренд'>
                            <option value="">None</option>
                            {ibans.map(el => <option style={{ width: '300px', wordBreak: 'break-all' }} value={el.IBAN} key={el.IBAN}>{el.IBAN}</option>)}
                        </select>
                        {
                            ibanErrorToDelete && <p style={{ color: 'red', fontSize: '16px', margin: '0 0 0 5px', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{ibanErrorToDelete}</p>
                        }
                    </div>
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
                                onChange={e => setPeriod(e)}
                                inputFormat="dd/MM/yyyy HH:mm"
                                ampm={false}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    <div>
                        {
                            ibanToDelete
                                ? <button
                                    onClick={SetLimit}
                                    style={{
                                        border: 'none',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgb(56, 182, 255)',
                                        fontFamily: "'Nunito',sans-serif",
                                        fontWeight: '600',
                                        color: 'white',
                                        fontSize: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        cursor: 'pointer'
                                    }}>
                                    Изменить
                                </button>
                                : <button
                                    onClick={CheckToEdit}
                                    style={{
                                        border: '1px solid rgb(56, 182, 255)',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        background: 'none',
                                        fontFamily: "'Nunito',sans-serif",
                                        fontWeight: '600',
                                        color: 'white',
                                        fontSize: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        cursor: 'pointer'
                                    }}>
                                    Изменить
                                </button>
                        }

                    </div>
                </Box>
            </Modal>
            <Modal
                open={openEditIban}
                onClose={handleEditIbanClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h2 style={{ fontFamily: "'Nunito',sans-serif", color: 'rgb(183, 220, 233)', marginTop: '0' }}>Изменить IBAN</h2>
                    <div style={{ width: '100%' }}>
                        <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>IBAN</label>
                        <select value={ibanToDelete} onChange={(e) => { setIbanToDelete(e.target.value); setIbanErrorToDelete('') }} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }} placeholder='Бренд'>
                            <option value="">None</option>
                            {ibans?.filter(elem => elem.Status === '0')?.map(el => <option style={{ width: '300px', wordBreak: 'break-all' }} value={el.IBAN} key={el.IBAN}>{el.IBAN}</option>)}
                        </select>
                        {
                            ibanErrorToDelete && <p style={{ color: 'red', fontSize: '16px', margin: '0 0 0 5px', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{ibanErrorToDelete}</p>
                        }
                        {
                            ibanToDelete && (
                                <div style={{ backgroundColor: 'white', width: '50%', borderRadius: '7px',marginTop:'10px' }}>
                                    <div style={{ backgroundColor: 'rgba(255, 237, 193, 0.5)', width: 'calc(100% - 2px)', borderRadius: '8px', border: '1px solid #FFECA1', height: 'calc(100% - 2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        <WarningIcon sx={{ color: '#D18E00', marginLeft: '10px' }} />
                                        <p style={{ fontSize: '13px', fontFamily: "'Nunito',sans-serif", fontWeight: '600', marginRight: '10px', color: '#D18E00' }}>
                                            IBAN выйдет из бана: <b>{moment(ibans.find(elem=> elem.IBAN === ibanToDelete).banPeriod).format('YYYY-MM-DD HH:mm')}</b>
                                        </p>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div>
                        {
                            ibanToDelete
                                ? <button
                                    onClick={unBan}
                                    style={{
                                        border: 'none',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgb(56, 182, 255)',
                                        fontFamily: "'Nunito',sans-serif",
                                        fontWeight: '600',
                                        color: 'white',
                                        fontSize: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        cursor: 'pointer'
                                    }}>
                                    Убрать из спама
                                </button>
                                : <button
                                    onClick={CheckToEdit}
                                    style={{
                                        border: '1px solid rgb(56, 182, 255)',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        background: 'none',
                                        fontFamily: "'Nunito',sans-serif",
                                        fontWeight: '600',
                                        color: 'white',
                                        fontSize: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        cursor: 'pointer'
                                    }}>
                                    Убрать из спама
                                </button>
                        }

                    </div>
                </Box>
            </Modal>
            <Snackbar
                open={snack}
                autoHideDuration={2000}
                onClose={handleCloseSnack}
                message={snackMessage}
            >
                <Alert severity={snackType}>{snackMessage}</Alert>

            </Snackbar>
        </div>
    )
}