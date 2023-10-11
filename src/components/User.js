import styles from '../styles/UsersList.module.scss'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import secureLocalStorage from 'react-secure-storage';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import Fade from '@mui/material/Fade';
import MuiAlert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MultipleSelectChip from '../pages/Panel/ChipSelect';
import $api from '../axios';

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
    width: '300px'
};

export default function User({ user, users, setUsers, selectAll, setSelectAll, setCheckbox, checkbox, brands }) {
    const [passViss, setIsPassViss] = useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [login, setLogin] = React.useState(user.login)
    const [password, setPassword] = React.useState(user.password? atob(user.password) : '********')
    const [loginDirty, setLoginDirty] = React.useState(false)
    const [passwordDirty, setPasswordDirty] = React.useState(false)
    const [loginError, setLoginError] = React.useState('')
    const [passwordError, setPasswordError] = React.useState('')
    const [authError, setAuthError] = React.useState('')
    const [brand, setBrand] = React.useState(user.brand)
    const [role, setRole] = React.useState(user.role);
    const [snack, setSnack] = React.useState(false);
    const [brandError, setBrandError] = React.useState('')
    const [roleError, setRoleError] = React.useState('')
    const [paymentsError, setPaymentsError] = React.useState('')
    const [isPinPayCheck, setIsPinPayCheck] = React.useState(user.methods.includes('PinPay'));
    const [isInsirexCheck, setIsInsirexCheck] = React.useState(user.methods.includes('Insirex'));
    const [isP2PCheck, setIsP2PCheck] = React.useState(user.methods.includes('P2P'));
    const [isWLXCheck, setIsWLXCheck] = React.useState(user.methods.includes('WLX'));
    const [selectedPayments, setSelectedPayments] = React.useState([]);
    const [choosenbrands, setChoosenBrands] = React.useState(user.brand ? brands.filter(item => user.brands.includes(item.brand)) : [])
    React.useEffect(() => {
        if (brands) {
            setChoosenBrands(brands.filter(item => user.brands.includes(item.brand)))
        }
    }, [brands])
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

            return updatedSelectedPayments;
        });
    }, [isPinPayCheck, isP2PCheck, isInsirexCheck, isWLXCheck]);

    React.useEffect(() => {
        if (user) {
            if (!user.methods.includes('PinPay')) {
                setIsPinPayCheck(false)
            }
            if (!user.methods.includes('Insirex')) {
                setIsInsirexCheck(false)
            }
            if (!user.methods.includes('P2P')) {
                setIsP2PCheck(false)
            }
            setBrand(user.brand)
            setRole(user.role)
            setLogin(user.login)
            setPassword(user.password?atob(user.password): '*******')
        }

    }, [user]);

    const handleOpen = () => setOpenModal(true);

    const handleModalClose = () => {
        setOpenModal(false)
        setLogin(user.login)
        setPassword(user.password?atob(user.password): '*******')
        setBrand(user.brand)
        setRole(user.role)
    };

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnack(false);
    };
    const loginHandler = (e) => {
        setLogin(e.target.value)
        setAuthError('')
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
        if (!loginError && !passwordError && login !== '' && password !== '') {
        } else {
            setLoginDirty(true)
            setPasswordDirty(true)
            setLoginError('Пожалуйста, введите логин.')
            setPasswordError('Пожалуйста, введите пароль.')
        }
    }
    const passwordHandler = (e) => {
        setPassword(e.target.value)
        setAuthError('')

        if (e.target.value.length < 5) {
            setPasswordError('Пароль замалий')
            if (!e.target.value) {
                setPasswordError('Пожалуйста, введите пароль')
            }
        } else {
            setPasswordError('')
        }
    }
    const BlurHandle = (e) => {
        switch (e.target.name) {
            case 'login':
                setLoginDirty(true)
                break
            case 'password':
                setPasswordDirty(true)
                break
            default:
                return
        }
    }
    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="warning"
                onClick={handleCloseSnack}

            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );
    const Delete = () => {
        Swal.fire({
            title: 'Вы уверенны?',
            text: "Вы не сможете восстановить пользователя!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Да',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const createdBy = secureLocalStorage.getItem('userId')
                    const userToken = secureLocalStorage.getItem('userToken')

                    const id = user.id
                    const { data } = await $api.post('/deleteUser', { id, createdBy });
                    await $api.post('/users', { userToken }).then(res => setUsers(res.data.reverse()))
                    Swal.fire(
                        "",
                        'Пользователь успешно удалён!',
                        'success'
                    )
                }
                catch (e) {
                    setSnack(true)
                    setAuthError(e.response.data.message.status)
                }
            }
        })
    }
    const Change = async () => {
        const userToken = secureLocalStorage.getItem('userToken')
        const id = user.id
        const userBrands = role === 'SuperAdmin' || role === 'Admin' ? choosenbrands : []
        try {
            const { data } = await $api.patch('/editUser', { login, password, brand, role, id, selectedPayments, userBrands, userToken })
            $api.post('/users', { userToken }).then(res => setUsers(res.data.reverse()))
            return data
        } catch (e) {
            console.log(e)
            setSnack(true)
            setAuthError(e.response.data.message.status)
        } finally {
            handleModalClose()
        }
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const theme = createTheme({
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: "8px",
                        backgroundColor: '#325A96',
                        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.45)",
                    },
                },
            },
        },
    });
    const handleSelect = (userId) => {
        if (selectAll) {
            setSelectAll(false);
        }
        setCheckbox((prev) => {
            if (prev.includes(userId)) {
                return prev.filter((id) => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };
    return (
        <div className={styles.user}>
            <div className={styles.body}>
                <h3 className={styles.id}>
                    {secureLocalStorage.getItem('role') === 'SuperAdmin' || secureLocalStorage.getItem('role') === 'Admin' 
                    ? <Checkbox
                        sx={{
                            color: '#b7dce9',
                            '&.Mui-checked': {
                                color: '#b7dce9',
                            },
                        }}
                        checked={checkbox.includes(user.id)}
                        onChange={() => handleSelect(user.id)}
                    /> : ''}
                </h3>
                <h3 className={styles.login}>{user.login}</h3>
                <h3 className={styles.password}>
                    {passViss && user.password ? atob(user.password) : '*******'}
                    {passViss ? <VisibilityOffIcon sx={{ cursor: 'pointer' }} onClick={() => setIsPassViss(false)} /> : <VisibilityIcon sx={{ cursor: 'pointer' }} onClick={() => setIsPassViss(true)} />}
                </h3>
                <h3 className={styles.brand}>{user.brand}</h3>
                <h3 className={styles.role}>{user.role}</h3>
                <div className={styles.methods}>
                    {user.methods.map(el => <h3 key={el}>{el}</h3>)}
                </div>
                <div className={styles.methods} style={{ width: '130px' }}>
                    {
                        user.brands.length > 0
                            ? <Tooltip title={user.brands.map(el => <div style={{ fontSize: '15px', fontFamily: "'Nunito',sans-serif" }} key={el}>{el}</div>)} arrow>
                                <ApartmentIcon />
                            </Tooltip>
                            : ''
                    }

                </div>
            </div>
            {secureLocalStorage.getItem('role') === 'SuperAdmin' || secureLocalStorage.getItem('role') === 'Admin' ?
                <span>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                        sx={{ marginRight: '20px' }}
                    >
                        <MoreVertIcon sx={{ color: 'white' }} />
                    </IconButton>
                    <ThemeProvider theme={theme}>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                                sx: { backgroundColor: '#325A96', color: 'white', borderRadius: '8px' }
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                        >
                            <MenuItem onClick={() => { handleClose(); handleOpen() }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 'bold', fontFamily: "'Nunito',sans-serif" }}>
                                    <EditIcon />Изменить
                                </div>
                            </MenuItem>
                            <MenuItem onClick={() => { handleClose(); Delete() }} sx={{ color: 'rgb(255, 72, 66)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 'bold', fontFamily: "'Nunito',sans-serif" }}>
                                    <DeleteIcon />Удалить
                                </div>
                            </MenuItem>
                        </Menu>
                    </ThemeProvider>
                </span>
                : ''}
            <ThemeProvider theme={theme}>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openModal}
                    onClose={handleModalClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >

                    <Fade in={open} >
                        <Box sx={style} style={{ opacity: '1', visibility: 'visible' }} >
                            <h3 style={{ color: 'white', width: '100%', textAlign: 'center', fontFamily: "'Nunito',sans-serif" }}>Изменение пользователя</h3>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Логин</label>
                                <input onBlur={BlurHandle} name='login' value={login} onChange={loginHandler} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px' }} placeholder='Логин' />
                                {
                                    loginDirty && loginError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{loginError}</div>
                                }
                            </div>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Пароль</label>
                                <input onBlur={BlurHandle} name='password' value={password} onChange={passwordHandler} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px' }} placeholder='Пароль' />
                                {
                                    passwordDirty && passwordError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{passwordError}</div>
                                }
                            </div>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Бренд</label>
                                <select name='Brand' onChange={e => { setBrand(e.target.value); setBrandError('') }} value={brand} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }} placeholder='Бренд'>
                                    <option value="">None</option>
                                    {Array.isArray(secureLocalStorage.getItem('brands'))? secureLocalStorage.getItem('brands').map(el => <option key={el} value={el}>{el}</option>) : ''}
                                </select>
                                {
                                    brandError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{brandError}</div>
                                }
                            </div>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Роль</label>
                                <select name='Role' onChange={(e) => { setRole(e.target.value); setRoleError('') }} value={role} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }} placeholder='Роль'>
                                    <option value="">None</option>
                                    {secureLocalStorage.getItem('role') === 'SuperAdmin' ? <option value="SuperAdmin">SuperAdmin</option> : ''}
                                    <option value="Admin">Админ</option>
                                    <option value="Financier">Финансист</option>
                                    <option value="User">Пользователь</option>
                                </select>
                                {
                                    roleError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{roleError}</div>
                                }
                            </div>
                            {(secureLocalStorage.getItem('role') === 'SuperAdmin' && role === 'Admin') || (secureLocalStorage.getItem('role') === 'SuperAdmin' && role === 'SuperAdmin')
                                ?
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Бренды для пользователя</label>
                                    <MultipleSelectChip brands={brands} choosenbrands={choosenbrands} setChoosenBrands={setChoosenBrands} />
                                </div>
                                : ''
                            }
                            <h3 style={{ color: 'white', fontFamily: "'Nunito' , sans-serif", margin: '0' }}>Выберите платежныe методы</h3>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                                <label className="lns-checkbox">
                                    <input type="checkbox" name='PinPay' checked={isPinPayCheck} onChange={(e) => setIsPinPayCheck(e.target.checked)} />
                                    <span>PinPay</span>
                                </label>
                                <label className="lns-checkbox">
                                    <input type="checkbox" name='Insirex' checked={isInsirexCheck} onChange={(e) => setIsInsirexCheck(e.target.checked)} />
                                    <span>Insirex</span>
                                </label>
                                <label className="lns-checkbox">
                                    <input type="checkbox" name='P2P' checked={isP2PCheck} onChange={(e) => setIsP2PCheck(e.target.checked)} />
                                    <span>P2P</span>
                                </label>
                                <label className="lns-checkbox">
                                    <input type="checkbox" name='WLX' checked={isWLXCheck} onChange={(e) => setIsWLXCheck(e.target.checked)} />
                                    <span>WLX</span>
                                </label>
                            </div>

                            {
                                !loginError && !passwordError && brand !== '' && role !== '' ? <button onClick={Change} style={{ padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', color: 'white', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', backgroundColor: '#38b6ff', cursor: 'pointer' }}>Изменить</button>
                                    : <button onClick={Check} style={{ padding: '15px 20px', color: 'white', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', background: 'none', cursor: 'pointer' }}>Изменить</button>
                            }
                        </Box>
                    </Fade>
                </Modal>
            </ThemeProvider>
            <Snackbar
                open={snack}
                autoHideDuration={4000}
                onClose={handleCloseSnack}
                message={authError}
                action={action}
            >
                <Alert severity="error" sx={{ fontFamily: "'Nunito' , sans-serif" }}>{authError}</Alert>
            </Snackbar>
        </div>
    )
}