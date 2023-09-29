import styles from '../../styles/Login.module.scss'
import Logo from '../../img/GPLogo.png'
import loginImg from '../../img/login.png'
import { useState } from 'react'
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { Routes, redirect, Route, useLocation, Navigate } from 'react-router-dom'
import InfoIcon from "@mui/icons-material/Info";
export default function Login() {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [loginDirty, setLoginDirty] = useState(false)
    const [passwordDirty, setPasswordDirty] = useState(false)
    const [loginError, setLoginError] = useState('Пожалуйста, введите логин.')
    const [passwordError, setPasswordError] = useState('Пожалуйста, введите пароль.')
    const [authError, setAuthError] = useState('')
    const [info ,setInfo] = useState(false)
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
    const Login = async () => {
        try {
            const { data } = await axios.post('http://localhost:5000/login', { login, password });
            if (data) {
                secureLocalStorage.setItem('role', data.role);
                secureLocalStorage.setItem('isLogged', true);
                secureLocalStorage.setItem('userId', data.id);
                secureLocalStorage.setItem('methods', data.methods);
                secureLocalStorage.setItem('brands', data.brands);
                console.log(data.id)
                if (data.role === 'SuperAdmin' || secureLocalStorage.getItem('role') === 'Admin'  || secureLocalStorage.getItem('role') === 'Financier') {
                    window.location.href = '/panel'
                } else {
                    window.location.href = '/payments_methods'
                }
            }

        } catch (e) {
            console.log(e.response.data.message)
            setAuthError(e.response.data.message.status)
        }
    }
    if (secureLocalStorage.getItem('isLogged') === true) {
        if (secureLocalStorage.getItem('role') === 'SuperAdmin' || secureLocalStorage.getItem('role') === 'Admin'  || secureLocalStorage.getItem('role') === 'Financier') {
            return <Navigate to={'/panel'} />
        } else {
            return <Navigate to={'/payments_methods'} />
        }
    }
    return (
        <div className={styles.login}>
            <div className={styles.leftSide}>
                <img className={styles.logo} src={Logo} alt='logo' />
                <h2>С возвращением!</h2>
                <p>Авторизируйтесь для создания своего <br/> первого платежа</p>
            </div>
            <div className={styles.body}>
                <h2>Авторизация</h2>
                <div className={styles.input}>
                    <label>Логин</label>
                    <input onBlur={BlurHandle} type='text' name='login' placeholder='Логин' onChange={loginHandler} />
                    {
                        loginDirty && loginError && <div style={{ color: 'red', fontSize: '16 px', margin: '0' }}>{loginError}</div>
                    }
                </div>
                <div className={styles.input} style={{marginTop:'15px'}}>
                    <label>Пароль</label>
                    <input onBlur={BlurHandle} type='password' name='password' placeholder='Пароль' onChange={passwordHandler} />
                    {
                        passwordDirty && passwordError && <div style={{ color: 'red', fontSize: '16 px', margin: '0' }}>{passwordError}</div>
                    }
                </div>
                {
                    !loginError && !passwordError ? <button className={styles.loginButton} onClick={Login}>Войти</button> : <button className={styles.loginDisable} onClick={Check}>Войти</button>
                }
                <p style={{ color: 'red' }}>{authError}</p>
                <p  className={styles.account}>Нет аккаунта? 
                    <InfoIcon style={{height:'18px' , width:'18px' , color:'white'}} onMouseEnter={()=>setInfo(true)} onMouseLeave={()=>setInfo(false)} />
                    {
                        info && (<span className={styles.infoBlock}>Обратитесь к администратору для создания аккаунта</span>)
                    }
                </p>
            </div>
        </div>


    )
}