import styles from '../styles/AddUsers.module.scss'
import AddIcon from '@mui/icons-material/Add';
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';
import UserList from './UserList';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
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
    gap:'15px',
    backgroundColor:'#233e68',
    width:"300px"
  };

export default function AddUsers(){
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const [login, setLogin] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [loginDirty, setLoginDirty] = React.useState(false)
    const [passwordDirty, setPasswordDirty] = React.useState(false)
    const [loginError, setLoginError] = React.useState('')
    const [passwordError, setPasswordError] = React.useState('')
    const [authError, setAuthError] = React.useState('')
    const [brand, setBrand] = React.useState('')
    const [role, setRole] = React.useState('');
    const [users,setUsers] = React.useState([])
    const [snack, setSnack] = React.useState(false);
    const [brandError, setBrandError] = React.useState('')
    const [roleError, setRoleError] = React.useState('')
    const [isPinPayCheck , setIsPinPayCheck] = React.useState(false);
    const [isInserixCheck , setIsInserixCheck] = React.useState(false);
    const [isP2PCheck , setIsP2PCheck] = React.useState(false);
    const [selectedPayments, setSelectedPayments] = React.useState([]);
    const [deletePayment, setDeletePayments] = React.useState('');

    const handleClose = () => {
        setOpen(false);
        setSelectedPayments([]);
        setIsP2PCheck(false);
        setIsInserixCheck(false);
        setIsPinPayCheck(false)
    };

    React.useEffect(() => {
      
        setSelectedPayments(prevSelectedPayments => {
          let updatedSelectedPayments = [...prevSelectedPayments];
      
          if (isPinPayCheck === true) {
            if(!selectedPayments.includes('1')){
                updatedSelectedPayments.push('1');
            }
          } else{
            updatedSelectedPayments = updatedSelectedPayments.filter(el => el !== '1');
          }
          if (isP2PCheck === true) {
            if(!selectedPayments.includes('3')){
                updatedSelectedPayments.push('3');
            }
          } else {
            updatedSelectedPayments = updatedSelectedPayments.filter(el => el !== '3');
          }
          if (isInserixCheck === true) {
            if(!selectedPayments.includes('2')){
                updatedSelectedPayments.push('2');
            }
          } else {
            updatedSelectedPayments = updatedSelectedPayments.filter(el => el !== '2');
          }
      
          return updatedSelectedPayments;
        });
      }, [isPinPayCheck, isP2PCheck,isInserixCheck]);

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
        if(brand === ''){
            setBrandError('Поле бренд не может быть пустым')
        }
        if(role === ''){
            setRoleError('Поле роль не может быть пустым')
        }
        if(!loginError && !passwordError && login !== '' && password !==''){
        }else{
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
            setPasswordError('Пароль состоит минимум из 5 символов')
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
      function generateRandomPassword(length) {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let password = "";
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset.charAt(randomIndex);
        }
      
        return password;
      }
      
    const Create = async () =>{
        const createdBy = secureLocalStorage.getItem('userId')
        try{
            const randomPassword = generateRandomPassword(10);
            const {data} = await axios.post('http://localhost:5000/registration', {login , randomPassword, brand , role, createdBy, selectedPayments})
            await axios.post('http://localhost:5000/users',{createdBy}).then(res=> setUsers(res.data.reverse()));
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
            axios.post('http://localhost:5000/users', {createdBy}).then(res=> setUsers(res.data.reverse()))
        }catch(e){
            console.log(e)
        }

    },[])
    return(
        <div className={styles.body}>
            <div className={styles.header}>
               <h1>Пользователи</h1>
               <div className={styles.buttons}>
                <button onClick={handleOpen} ><AddIcon/>Добавить <br/>платежный метод </button>
                  <button className={styles.deleteButton} onClick={handleOpen}><DeleteIcon/>Удалить<br/> платежный метод</button>
                  <button onClick={handleOpen} ><AddIcon/>Добавить <br/>пользователя</button>
               </div>
            </div>
            <div className={styles.table}>
                <UserList users={users} setUsers={setUsers}/>
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
                    <h3 style={{color:'white' , width:'100%' ,textAlign:'center' , fontFamily:"'Nunito',sans-serif"}}>Создание пользователя</h3>
                    <div style={{width:'100%' , display:'flex' , flexDirection:'column'}}>
                        <label style={{color:'white' , width:'100%', fontFamily:"'Nunito',sans-serif"}}>Логин</label>
                        <input onBlur={BlurHandle} name='login' onChange={loginHandler} style={{outline:'none', padding:'15px 20px', fontFamily:'"Nunito"  ,sans-serif' , fontSize:'18px' , border:'1px solid #38b6ff', borderRadius:'8px'}} placeholder='Логин'/>
                        {
                            loginDirty && loginError && <div style={{color:'red', fontSize:'13px', margin:'0' , fontFamily:"'Nunito',sans-serif",fontWeight:'bold'}}>{loginError}</div>
                        }
                    </div>
                    {/* <div style={{width:'100%' , display:'flex' , flexDirection:'column'}}>
                        <label style={{color:'white' , width:'100%', fontFamily:"'Nunito',sans-serif"}}>Пароль</label>
                        <input onBlur={BlurHandle} name='password' onChange={passwordHandler} style={{outline:'none', padding:'15px 20px', fontFamily:'"Nunito"  ,sans-serif' , fontSize:'18px' , border:'1px solid #38b6ff', borderRadius:'8px'}} placeholder='Пароль'/>
                        {
                            passwordDirty && passwordError && <div style={{color:'red', fontSize:'13px', margin:'0' , fontFamily:"'Nunito',sans-serif",fontWeight:'bold'}}>{passwordError}</div>
                        }
                    </div> */}
                    <div style={{width:'100%' , display:'flex' , flexDirection:'column'}}>
                        <label style={{color:'white' , width:'100%', fontFamily:"'Nunito',sans-serif"}}>Бренд</label>
                        <select onChange={(e)=> {setBrand(e.target.value); setBrandError('')}} style={{outline:'none', padding:'15px 20px', fontFamily:'"Nunito"  ,sans-serif' , fontSize:'18px' , border:'1px solid #38b6ff', borderRadius:'8px' , width:'100%'}} placeholder='Бренд'>
                            <option value="">None</option>
                            <option value="SafeInvest">SafeInvest</option>
                            <option value="VetalInvest">VetalInvest</option>
                            <option value="RiseInvest">RiseInvest</option>
                            <option value="Revolut">Revolut</option>
                            <option value="InfinityInvest">InfinityInvest</option>
                        </select>
                        {
                            brandError && <div style={{color:'red', fontSize:'13px', margin:'0' , fontFamily:"'Nunito',sans-serif",fontWeight:'bold'}}>{brandError}</div>
                        }
                    </div>
                    <div style={{width:'100%' , display:'flex' , flexDirection:'column'}}>
                        <label style={{color:'white' , width:'100%', fontFamily:"'Nunito',sans-serif"}}>Роль</label>
                        <select onChange={(e)=> {setRole(e.target.value); setRoleError('')}} style={{outline:'none', padding:'15px 20px', fontFamily:'"Nunito"  ,sans-serif' , fontSize:'18px' , border:'1px solid #38b6ff', borderRadius:'8px' ,  width:'100%'}} placeholder='Роль'>
                            <option value="">None</option>
                            {secureLocalStorage.getItem('role') === 'SuperAdmin'? <option value="SuperAdmin">SuperAdmin</option>: ''}
                            <option value="Admin">Админ</option>
                            <option value="Financier">Финансист</option>
                        </select>
                        {
                            roleError && <div style={{color:'red', fontSize:'13px', margin:'0' , fontFamily:"'Nunito',sans-serif",fontWeight:'bold'}}>{roleError}</div>
                        }
                    </div>
                    <h3 style={{color:'white' , fontFamily:"'Nunito' , sans-serif" , margin:'0'}}>Выберите платежныe методы</h3>
                    <div style={{display:'flex' , gap:'10px' , flexWrap:'wrap' , alignItems:'center' , justifyContent:'center'}}>
                        <label className="lns-checkbox">
                            <input type="checkbox" value={isPinPayCheck} onChange={(e)=> setIsPinPayCheck(e.target.checked)}/>
                            <span>PinPay</span>
                        </label>
                        <label className="lns-checkbox" >
                            <input type="checkbox" value={isInserixCheck} onChange={(e)=> setIsInserixCheck(e.target.checked)}/>
                            <span>Inserix</span>
                        </label>
                        <label className="lns-checkbox">
                            <input type="checkbox" value={isP2PCheck} onChange={(e)=> setIsP2PCheck(e.target.checked)}/>
                            <span>P2P</span>
                        </label>
                    </div>
                    {
                        !loginError  && !passwordError && brand !=='' && role !=='' ? <button onClick={Create} style={{padding:'15px 20px', fontFamily:'"Nunito"  ,sans-serif' , color:'white' , fontSize:'18px' , border:'1px solid #38b6ff', borderRadius:'8px' , backgroundColor:'#38b6ff', cursor:'pointer'}}>Создать</button> 
                        : <button onClick={Check} style={{padding:'15px 20px',color:'white' ,  fontFamily:'"Nunito"  ,sans-serif' , fontSize:'18px' , border:'1px solid #38b6ff', borderRadius:'8px' , background:'none', cursor:'pointer'}}>Создать</button>
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