import styles from '../styles/AddUsers.module.scss'
import AddIcon from '@mui/icons-material/Add';
import UsersTable from './UsersTable';
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';
import UserList from './UserList';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';

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
    borderRadius:'12px',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'column',
    gap:'15px'
  };

export default function AddUsers(){
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [login, setLogin] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [loginDirty, setLoginDirty] = React.useState(false)
    const [passwordDirty, setPasswordDirty] = React.useState(false)
    const [loginError, setLoginError] = React.useState('Пожалуйста, введите логин.')
    const [passwordError, setPasswordError] = React.useState('Пожалуйста, введите пароль.')
    const [authError, setAuthError] = React.useState('')
    const [brand, setBrand] = React.useState('')
    const [role, setRole] = React.useState('');
    const [users,setUsers] = React.useState([])
    const [snack, setSnack] = React.useState(false);

    const handleClick = () => {
        setSnack(true);
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
    const Check = () =>{
        setLoginDirty(true)
        setPasswordDirty(true)
        setLoginError('Пожалуйста, введите логин.')
        setPasswordError('Пожалуйста, введите пароль.')
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
    const Create = async () =>{
        const createdBy = secureLocalStorage.getItem('userId')
        try{
            const {data} = await axios.post('http://localhost:5000/registration', {login , password, brand , role, createdBy})
            await axios.post('http://localhost:5000/users',{createdBy}).then(res=> setUsers(res.data[0].reverse()));
            return data
        }catch(e){
            console.log(e)
            setSnack(true)
            setAuthError(e.response.data.message.status)
        }finally{
            handleClose()
        }
    }
    React.useEffect( ()=>{
        const createdBy = secureLocalStorage.getItem('userId')
        try{
            axios.post('http://localhost:5000/users', {createdBy}).then(res=> setUsers(res.data[0].reverse()))
        }catch(e){
            console.log(e)
        }

    },[])
    return(
        <div className={styles.body}>
            <div className={styles.header}>
               <h1>Пользователи</h1>
               <button onClick={handleOpen} ><AddIcon/>Добавить</button>
            </div>
            <div className={styles.table}>
                <UserList users={users} setUsers={setUsers}/>
            </div>
            {/* <div className={styles.table}><UsersTable users={users}/></div> */}
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
                    <input onBlur={BlurHandle} name='login' onChange={loginHandler} style={{outline:'none', padding:'15px 20px', fontFamily:'"Nunito"  ,sans-serif' , fontSize:'18px' , border:'1px solid #38b6ff', borderRadius:'8px'}} placeholder='Логин'/>
                    {
                        loginDirty && loginError && <div style={{color:'red', fontSize:'12px', margin:'0'}}>{loginError}</div>
                    }
                    <input onBlur={BlurHandle} name='password' onChange={passwordHandler} style={{outline:'none', padding:'15px 20px', fontFamily:'"Nunito"  ,sans-serif' , fontSize:'18px' , border:'1px solid #38b6ff', borderRadius:'8px'}} placeholder='Пароль'/>
                    {
                        passwordDirty && passwordError && <div style={{color:'red', fontSize:'12px', margin:'0'}}>{passwordError}</div>
                    }
                    <select onChange={e=> setBrand(e.target.value)} style={{outline:'none', padding:'15px 20px', fontFamily:'"Nunito"  ,sans-serif' , fontSize:'18px' , border:'1px solid #38b6ff', borderRadius:'8px' , width:'100%'}} placeholder='Бренд'>
                        <option value="0">None</option>
                        <option value="SafeInvest">SafeInvest</option>
                        <option value="VetalInvest">VetalInvest</option>
                        <option value="RiseInvest">RiseInvest</option>
                        <option value="Revolut">Revolut</option>
                        <option value="InfinityInvest">InfinityInvest</option>
                    </select>
                    <select onChange={e=> setRole(e.target.value)} style={{outline:'none', padding:'15px 20px', fontFamily:'"Nunito"  ,sans-serif' , fontSize:'18px' , border:'1px solid #38b6ff', borderRadius:'8px' ,  width:'100%'}} placeholder='Роль'>
                    <option value="0">None</option>
                    {secureLocalStorage.getItem('role') === 'SuperAdmin'? <option value="SuperAdmin">SuperAdmin</option>: ''}
                        <option value="Admin">Админ</option>
                        <option value="Financier">Финансист</option>
                    </select>
                    {
                        !loginError  && !passwordError && brand && role ? <button onClick={Create} style={{padding:'15px 20px', fontFamily:'"Nunito"  ,sans-serif' , color:'white' , fontSize:'18px' , border:'1px solid #38b6ff', borderRadius:'8px' , backgroundColor:'#38b6ff', cursor:'pointer'}}>Создать</button> 
                        : <button onClick={Check} style={{padding:'15px 20px', fontFamily:'"Nunito"  ,sans-serif' , fontSize:'18px' , border:'1px solid #38b6ff', borderRadius:'8px' , background:'none', cursor:'pointer'}}>Создать</button>
                    }
                </Box>
                </Fade>
      </Modal>
      <div>
        <Snackbar
            open={snack}
            autoHideDuration={4000}
            onClose={handleCloseSnack}
            message={authError}
            action={action}
        >
        <Alert severity="error">{authError}</Alert>

        </Snackbar>
        </div>
        </div>
    )
}