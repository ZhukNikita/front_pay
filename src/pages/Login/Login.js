import styles from '../../styles/Login.module.scss'
import Logo from '../../img/GPLogo.png'
import { useState } from 'react'
import axios from "axios";
import  secureLocalStorage  from  "react-secure-storage";
import {Routes, redirect , Route , useLocation, Navigate} from 'react-router-dom'

export default function Login() {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [loginDirty, setLoginDirty] = useState(false)
    const [passwordDirty, setPasswordDirty] = useState(false)
    const [loginError, setLoginError] = useState('Пожалуйста, введите логин.')
    const [passwordError, setPasswordError] = useState('Пожалуйста, введите пароль.')
    const [authError, setAuthError] = useState('')

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
    const Login = async()=>{
        try{
            const {data} = await axios.post('http://localhost:5000/login',{login,password});
            if(data){
                secureLocalStorage.setItem('role' , data.existingUsers[0].role);
                secureLocalStorage.setItem('isLogged' , true);
                secureLocalStorage.setItem('userId' , data.existingUsers[0].id);
                if(data.existingUsers[0].role === 'SuperAdmin') {
                    window.location.href = 'http://localhost:3000/panel'
                }else {
                    window.location.href = 'http://localhost:3000/'
                }
            }

        }catch(e){
            console.log(e.response.data.message)
            setAuthError(e.response.data.message.status)
        }
    }
    if(secureLocalStorage.getItem('isLogged') === true){
        if(secureLocalStorage.getItem('role') === 'SuperAdmin') {
            return <Navigate to={'/panel'}/>
        }else {
            return <Navigate to={'/'}/>
        }
    }

    return(
        <div className={styles.body}>
            <img className={styles.logo} src={Logo}/>
            <div className={styles.input}>
                <label>Логин</label>
                <input onBlur={BlurHandle} name='login' placeholder='Логин' onChange={loginHandler}/>
                {
                    loginDirty && loginError && <div style={{color:'red', fontSize:'16 px', margin:'0'}}>{loginError}</div>
                }
            </div>
            <div className={styles.input}>
                <label>Пароль</label>
                <input onBlur={BlurHandle} name='password' placeholder='Пароль' onChange={passwordHandler}/>
                {
                    passwordDirty && passwordError && <div style={{color:'red', fontSize:'16 px', margin:'0'}}>{passwordError}</div>
                }
            </div>
            {
                 !loginError && !passwordError ? <button className={styles.login} onClick={Login}>Войти</button> : <button className={styles.loginDisable} onClick={Check}>Войти</button>
            }
            <p style={{color:'red'}}>{authError}</p>
            
        </div>
    )
}