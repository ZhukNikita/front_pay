import React, { useState } from 'react'
import styles from './RuCassaTransactionsBody.module.scss'
import RuCassaTransactionsList from './RuCassaTransactionsList'
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
export default function RuCassaTransactionsBody() {
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleOpenDelete = () => setOpenDelete(true);
    const [iban1, setIban] = useState('')
    const [ibanToDelete, setIbanToDelete] = useState('')
    const [ibanError, setIbanError] = useState('')
    const [ibanErrorToDelete, setIbanErrorToDelete] = useState('')
    const [recipient, setRecipient] = useState('')
    const [recipientError, setRecipientError] = useState('')
    const [bank, setBank] = useState('')
    const [bankError, setBankError] = useState('')
    const [bic, setBic] = useState('')
    const [bicError, setBicError] = useState('')
    const [ibans, setIbans] = useState([])
    const [snack, setSnack] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [snackType, setSnackType] = useState('');

    const handleClose = () => {
        setOpen(false);
        setIban('');
        setRecipient('');
        setBank('');
        setBic('');
    };
    const handleDeleteClose = () => {
        setOpenDelete(false);
        setIbanToDelete('');
    };
    const CheckToDelete = () => {
        if (!ibanToDelete) {
            setIbanErrorToDelete('Выберите IBAN для удаления')
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
        if (!bic) {
            setBicError('Введите BIC банка')
        }
    }

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackMessage('')
        setSnack(false);
    };
    const Create = async () => {
        const createdBy = secureLocalStorage.getItem('userId')
        const iban = iban1.replace(/\s/g, "")
        try {
            const { data } = await $api.post('/createIban', { iban, recipient, bank, bic, createdBy })
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
            // await $api.get('/p2pGetAll').then(res => setIbans(res.data))
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
                <h1>Транзакции RuCassa</h1>
                <div className={styles.buttons}>
                    {
                        secureLocalStorage.getItem('role') === 'SuperAdmin' ?''
                            // <>
                            //     <button onClick={handleOpen}><AccountBalanceIcon />Добавить IBAN</button>
                            //     <button onClick={handleOpenDelete} style={{ backgroundColor: '#ad2824', color: '#ffa6b2' }}><DeleteOutlineIcon />Удалить IBAN</button>
                            //     <Link to={'/rucassa-deleted-transactions'} className={styles.deletedTransactions}>Удаленные транзакции</Link>
                            // </>

                            : <></>
                    }
                </div>

            </div>
            <RuCassaTransactionsList ibans={ibans} setIbans={setIbans} />
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
                            {
                                bicError ? <p style={{ width: '182px', margin: '0 0 0 5px', color: 'red', fontFamily: '"Nunito"  ,sans-serif', fontWeight: 'bold' }}>{bicError}</p> : ''
                            }
                        </div>
                        <div style={{ backgroundColor: 'white', width: '46%', borderRadius: '7px' }}>
                            <div style={{ backgroundColor: 'rgba(255, 237, 193, 0.5)', width: 'calc(100% - 2px)', borderRadius: '8px', border: '1px solid #FFECA1', height: 'calc(100% - 2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <WarningIcon sx={{ color: '#D18E00', marginLeft: '10px' }} />
                                <p style={{ fontSize: '13px', fontFamily: "'Nunito',sans-serif", fontWeight: '600', marginRight: '10px', color: '#D18E00' }}>Перед созданием, пожалуйста, убедитесь в правильности всех введенных данных!</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        {
                            iban1 && bic && recipient && bank
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