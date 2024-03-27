import styles from '../styles/AddUsers.module.scss'
import AddIcon from '@mui/icons-material/Add';
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import secureLocalStorage from 'react-secure-storage';
import UserList from './UserList';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MultipleSelectChip from '../pages/Panel/ChipSelect';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import $api from "../axios";
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
    width: "300px"
};

export default function AddUsers() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const [login, setLogin] = React.useState('');
    const [loginDirty, setLoginDirty] = React.useState(false);
    const [loginError, setLoginError] = React.useState('');
    const [brand, setBrand] = React.useState('');
    const [role, setRole] = React.useState('');
    const [users, setUsers] = React.useState([])
    const [snack, setSnack] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState('');
    const [snackType, setSnackType] = React.useState('');
    const [brandError, setBrandError] = React.useState('');
    const [roleError, setRoleError] = React.useState('');
    const [isPinPayCheck, setIsPinPayCheck] = React.useState(false);
    const [isInsirexCheck, setIsInsirexCheck] = React.useState(false);
    const [isP2PCheck, setIsP2PCheck] = React.useState(false);
    const [isWLXCheck, setIsWLXCheck] = React.useState(false);
    const [isShpCheck, setIsShpCheck] = React.useState(false);
    const [isRuCassaCheck, setIsRuCassaCheck] = React.useState(false);
    const [isAdvCashCheck, setIsAdvCashCheck] = React.useState(false);
    const [isLinkPayCheck, setIsLinkPayCheck] = React.useState(false);
    const [isNowPayCheck, setIsNowPayCheck] = React.useState(false);
    const [isPrMoneyCheck, setIsPrMoneyCheck] = React.useState(false);
    const [selectedPayments, setSelectedPayments] = React.useState([]);
    const [openBrandModal, setOpenBrandModal] = React.useState(false);
    const [openDeleteBrandModal, setOpenDeleteBrandModal] = React.useState(false);
    const [newBrand, setNewBrand] = React.useState('');
    const [deleteBrand, setDeleteBrand] = React.useState('');
    const [brands, setBrands] = React.useState([]);
    const [choosenbrands, setChoosenBrands] = React.useState([]);
    const handleClose = () => {
        setOpen(false);
        setSelectedPayments([]);
        setIsP2PCheck(false);
        setIsWLXCheck(false);
        setIsInsirexCheck(false);
        setIsPinPayCheck(false)
        setIsAdvCashCheck(false)
        setIsShpCheck(false)
        setIsRuCassaCheck(false)
        setIsLinkPayCheck(false)
        setIsNowPayCheck(false)
        setIsPrMoneyCheck(false)
        setChoosenBrands([])
        setRole('')
        setLogin('')
        setBrand('')

    };

    const handleCloseBrandModal = () => {
        setOpenBrandModal(false);
        setNewBrand('')
        setBrandError('')
    };
    const handleCloseDeleteBrandModal = () => {
        setOpenDeleteBrandModal(false);
        setDeleteBrand('')
        setBrandError('')
    };

    React.useEffect(() => {

        setSelectedPayments(prevSelectedPayments => {
            let updatedSelectedPayments = [...prevSelectedPayments];

            if (isPinPayCheck === true) {
                if (!selectedPayments.includes('1')) {
                    updatedSelectedPayments.push('1');
                }
            } else {
                updatedSelectedPayments = updatedSelectedPayments.filter(el => el !== '1');
            }
            if (isNowPayCheck === true) {
                if (!selectedPayments.includes('9')) {
                    updatedSelectedPayments.push('9');
                }
            } else {
                updatedSelectedPayments = updatedSelectedPayments.filter(el => el !== '9');
            }
            if (isPrMoneyCheck === true) {
                if (!selectedPayments.includes('10')) {
                    updatedSelectedPayments.push('10');
                }
            } else {
                updatedSelectedPayments = updatedSelectedPayments.filter(el => el !== '10');
            }
            if (isLinkPayCheck === true) {
                if (!selectedPayments.includes('8')) {
                    updatedSelectedPayments.push('8');
                }
            } else {
                updatedSelectedPayments = updatedSelectedPayments.filter(el => el !== '8');
            }
            if (isShpCheck === true) {
                if (!selectedPayments.includes('6')) {
                    updatedSelectedPayments.push('6');
                }
            } else {
                updatedSelectedPayments = updatedSelectedPayments.filter(el => el !== '6');
            }
            if (isAdvCashCheck === true) {
                if (!selectedPayments.includes('5')) {
                    updatedSelectedPayments.push('5');
                }
            } else {
                updatedSelectedPayments = updatedSelectedPayments.filter(el => el !== '5');
            }
            if (isP2PCheck === true) {
                if (!selectedPayments.includes('3')) {
                    updatedSelectedPayments.push('3');
                }
            } else {
                updatedSelectedPayments = updatedSelectedPayments.filter(el => el !== '3');
            }
            if (isWLXCheck === true) {
                if (!selectedPayments.includes('4')) {
                    updatedSelectedPayments.push('4');
                }
            } else {
                updatedSelectedPayments = updatedSelectedPayments.filter(el => el !== '4');
            }
            if (isInsirexCheck === true) {
                if (!selectedPayments.includes('2')) {
                    updatedSelectedPayments.push('2');
                }
            } else {
                updatedSelectedPayments = updatedSelectedPayments.filter(el => el !== '2');
            }
            if (isRuCassaCheck === true) {
                if (!selectedPayments.includes('7')) {
                    updatedSelectedPayments.push('7');
                }
            } else {
                updatedSelectedPayments = updatedSelectedPayments.filter(el => el !== '7');
            }

            return updatedSelectedPayments;
        });
    }, [isPinPayCheck, isP2PCheck, isInsirexCheck, isWLXCheck, isShpCheck,isAdvCashCheck,isRuCassaCheck, isLinkPayCheck, isNowPayCheck, isPrMoneyCheck]);

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackMessage('')
        setSnack(false);
    };



    const loginHandler = (e) => {
        setLogin(e.target.value)
        if (e.target.value.length < 5) {
            setLoginError('Логин состоит минимум из 5 символов')
            if (!e.target.value) {
                setLoginError('Пожалуйста, введите логин.')
            }
        } else {
            setLoginError('')
        }
    }
    const Check = () => {
        if (brand === '') {
            setBrandError('Поле бренд не может быть пустым')
        }
        if (role === '') {
            setRoleError('Поле роль не может быть пустым')
        }
        if (!loginError && login !== '') {
        } else {
            setLoginDirty(true)
            setLoginError('Пожалуйста, введите логин.')
        }
    }
    const BlurHandle = (e) => {
        switch (e.target.name) {
            case 'login':
                setLoginDirty(true)
                break
            default:
                return
        }
    }
    function generateRandomPassword(length) {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let password = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset.charAt(randomIndex);
        }
        return password;
    }
    const Create = async () => {
        const createdBy = secureLocalStorage.getItem('userId')
        const brandsId = choosenbrands.map(el => `${el.id}`)
        const userToken = secureLocalStorage.getItem('userToken')
        
        try {
            const randomPassword = generateRandomPassword(10);
            const { data } = await $api.post('/registration', { login, randomPassword, brand, role, createdBy, selectedPayments, brandsId })
            $api.post('/users', { userToken }).then(res => setUsers(res.data.reverse()))

            return data
        } catch (e) {
            console.log(e)
            setSnack(true)
            setSnackType('error')
            setSnackMessage(e.response.data.message.status)
        } finally {
            handleClose()
        }
    }

    const AddBrand = async () => {
        let newBrandError = '';
        if (newBrand === '') {
            setBrandError('Введите бренд');
            newBrandError = 'Введите бренд'
        }
        if (/[^\x00-\x7F]+/.test(newBrand)) {
            setBrandError('Введите бренд латинскими буквами алфавита');
            newBrandError = 'Введите бренд латинскими буквами алфавита'
        }
        if (newBrandError === '') {
            try {
                const createdBy = secureLocalStorage.getItem('userId')
                await $api.post('/createBrand', { newBrand, createdBy })
                await $api.post('/getBrands', { createdBy }).then(res => setBrands(res.data))
                setSnackMessage('Бренд успешно создан');
                setSnackType('success');
                setSnack(true)
            } catch (e) {
                console.log(e)
                setSnack(true)
                setSnackType('error');
                setSnackMessage(e.response.data.message.status)
            } finally {
                handleCloseBrandModal()
            }
        }
    }
    const DeleteBrand = async () => {
        let deleteBrandError = '';
        if (deleteBrand === '') {
            setBrandError('Введите бренд');
            deleteBrandError = 'Введите бренд'
        }
        if (deleteBrandError === '') {
            try {
        const userToken = secureLocalStorage.getItem('userToken')
                const createdBy = secureLocalStorage.getItem('userId')
                await $api.post('/deleteBrand', { deleteBrand, createdBy })
                await $api.post('/getBrands', { createdBy }).then(res => setBrands(res.data))
                await $api.post('/users', { userToken }).then(res => setUsers(res.data.reverse()))
                setSnackMessage('Бренд успешно удалён');
                setSnackType('success');
                setSnack(true)
            } catch (e) {
                console.log(e)
                setSnack(true)
                setSnackType('error');
                setSnackMessage(e.response.data.message.status)
            } finally {
                handleCloseDeleteBrandModal()
            }
        }
    }
    React.useEffect(() => {
        const createdBy = secureLocalStorage.getItem('userId')
        const userToken = secureLocalStorage.getItem('userToken')
        const fetchData = async () => {
            try {
                await $api.post('/users', { userToken }).then(res => setUsers(res.data.reverse()))
                await $api.post('/getBrands', { createdBy }).then(res => setBrands(res.data))
            } catch (e) {

            }
        }
        fetchData()
    }, [])
    React.useEffect(() => {
        if (role === 'Financier' || role === 'User') {
            setChoosenBrands([])
        }
    }, [role])
    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <h1>Пользователи</h1>
                <div className={styles.buttons}>
                    {
                        secureLocalStorage.getItem('role') === 'SuperAdmin' ?
                            <button onClick={() => setOpenBrandModal(true)} ><ApartmentIcon />Создать <br />бренд</button>
                            : ''
                    }
                    {
                        secureLocalStorage.getItem('role') === 'SuperAdmin' ?
                            <button className={styles.deleteButton} onClick={() => setOpenDeleteBrandModal(true)} ><DeleteOutlineIcon />Удалить <br />бренд</button>
                            : ''
                    }
                    {
                        secureLocalStorage.getItem('role') === 'SuperAdmin' || secureLocalStorage.getItem('role') === 'Admin' 
                        ?<button onClick={handleOpen} ><AddIcon />Добавить <br />пользователя</button>
                        : ''
                    }
                    
                </div>
            </div>
            <div className={styles.table}>
                <UserList users={users} setUsers={setUsers} brands={brands} />
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
                        <h3 style={{ color: 'white', width: '100%', textAlign: 'center', fontFamily: "'Nunito',sans-serif" }}>Создание пользователя</h3>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Логин</label>
                            <input onBlur={BlurHandle} name='login' onChange={loginHandler} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px' }} placeholder='Логин' />
                            {
                                loginDirty && loginError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{loginError}</div>
                            }
                        </div>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Бренд</label>
                            <select onChange={(e) => { setBrand(e.target.value); setBrandError('') }} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }} placeholder='Бренд'>
                                <option value="">None</option>
                                {Array.isArray(secureLocalStorage.getItem('brands'))?  secureLocalStorage.getItem('brands').map(el => <option key={el} value={el}>{el}</option>) : ''}
                            </select>
                            {
                                brandError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{brandError}</div>
                            }
                        </div>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Роль</label>
                            <select onChange={(e) => { setRole(e.target.value); setRoleError('') }} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }} placeholder='Роль'>
                                <option value="">None</option>
                                {secureLocalStorage.getItem('role') === 'SuperAdmin' ? <option value="SuperAdmin">SuperAdmin</option> : ''}
                                <option value="Admin">Админ</option>
                                <option value="SuperFinancier">Главный финансист</option>
                                <option value="Financier">Финансист</option>
                                <option value="User">Пользователь</option>
                            </select>
                            {
                                roleError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{roleError}</div>
                            }
                        </div>
                        {
                            (secureLocalStorage.getItem('role') === 'SuperAdmin' && role === 'Admin') || (secureLocalStorage.getItem('role') === 'SuperAdmin' && role === 'SuperAdmin') ?
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Бренды для пользователя</label>
                                    <MultipleSelectChip brands={brands} choosenbrands={choosenbrands} setChoosenBrands={setChoosenBrands} />
                                </div>
                                : ''
                        }
                        <h3 style={{ color: 'white', fontFamily: "'Nunito' , sans-serif", margin: '0' }}>Выберите платежныe методы</h3>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                            <label className="lns-checkbox">
                                <input type="checkbox" value={isPinPayCheck} onChange={(e) => setIsPinPayCheck(e.target.checked)} />
                                <span>PinPay</span>
                            </label>
                            <label className="lns-checkbox" >
                                <input type="checkbox" value={isInsirexCheck} onChange={(e) => setIsInsirexCheck(e.target.checked)} />
                                <span>Insirex</span>
                            </label>
                            <label className="lns-checkbox">
                                <input type="checkbox" value={isP2PCheck} onChange={(e) => setIsP2PCheck(e.target.checked)} />
                                <span>P2P</span>
                            </label>
                            <label className="lns-checkbox">
                                <input type="checkbox" value={isWLXCheck} onChange={(e) => setIsWLXCheck(e.target.checked)} />
                                <span>WLX</span>
                            </label>
                            <label className="lns-checkbox">
                                <input type="checkbox" value={isShpCheck} onChange={(e) => setIsShpCheck(e.target.checked)} />
                                <span>shp.ee</span>
                            </label>
                            <label className="lns-checkbox">
                                <input type="checkbox" value={isAdvCashCheck} onChange={(e) => setIsAdvCashCheck(e.target.checked)} />
                                <span>AdvCash</span>
                            </label>
                            <label className="lns-checkbox">
                                <input type="checkbox" value={isRuCassaCheck} onChange={(e) => setIsRuCassaCheck(e.target.checked)} />
                                <span>RuCassa</span>
                            </label>
                            <label className="lns-checkbox">
                                <input type="checkbox" value={isLinkPayCheck} onChange={(e) => setIsLinkPayCheck(e.target.checked)} />
                                <span>LinkPay</span>
                            </label>
                            <label className="lns-checkbox">
                                <input type="checkbox" value={isNowPayCheck} onChange={(e) => setIsNowPayCheck(e.target.checked)} />
                                <span>NowPay</span>
                            </label>
                            <label className="lns-checkbox">
                                <input type="checkbox" value={isPrMoneyCheck} onChange={(e) => setIsPrMoneyCheck(e.target.checked)} />
                                <span>PrMoney</span>
                            </label>
                        </div>
                        {
                            !loginError && brand !== '' && role !== '' ? <button onClick={Create} style={{ padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', color: 'white', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', backgroundColor: '#38b6ff', cursor: 'pointer' }}>Создать</button>
                                : <button onClick={Check} style={{ padding: '15px 20px', color: 'white', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', background: 'none', cursor: 'pointer' }}>Создать</button>
                        }
                    </Box>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openBrandModal}
                onClose={handleCloseBrandModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openBrandModal}>
                    <Box sx={style}>
                        <h3 style={{ color: 'white', width: '100%', textAlign: 'center', fontFamily: "'Nunito',sans-serif", marginBottom: '0px' }}>Создать новый бренд</h3>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Название бренда</label>
                            <input name='newBrand' onChange={(e) => setNewBrand(e.target.value)} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px' }} placeholder='Бренд' />
                            {
                                brandError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{brandError}</div>
                            }
                        </div>
                        <button onClick={AddBrand} style={!brandError && newBrand ?
                            { padding: '15px 20px', color: 'white', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', background: '#38b6ff', cursor: 'pointer' }
                            : { padding: '15px 20px', color: 'white', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', background: 'none', cursor: 'pointer' }}>Создать</button>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openDeleteBrandModal}
                onClose={handleCloseDeleteBrandModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openDeleteBrandModal}>
                    <Box sx={style}>
                        <h3 style={{ color: 'white', width: '100%', textAlign: 'center', fontFamily: "'Nunito',sans-serif", marginBottom: '0px' }}>Удалить бренд</h3>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Название бренда</label>
                            {brands?
                                                       <select value={deleteBrand} onChange={(e)=>setDeleteBrand(e.target.value)} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }}>
                                                       <option value=''>None</option>
                                                       {brands.map(el=> <option key={el.id} value={el.brand}>{el.brand}</option>)}
                                                   </select>:'' 
                        }

                            {
                                brandError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{brandError}</div>
                            }
                        </div>
                        <button onClick={DeleteBrand} style={!brandError && deleteBrand !== '' ?
                            { padding: '15px 20px', color: 'white', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', background: '#38b6ff', cursor: 'pointer' }
                            : { padding: '15px 20px', color: 'white', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', background: 'none', cursor: 'pointer' }}>Удалить</button>
                    </Box>
                </Fade>
            </Modal>
            <div>
                <Snackbar
                    open={snack}
                    autoHideDuration={2000}
                    onClose={handleCloseSnack}
                    message={snackMessage}
                >
                    <Alert severity={snackType}>{snackMessage}</Alert>

                </Snackbar>
            </div>
        </div>
    )
}