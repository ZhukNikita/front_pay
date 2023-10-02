import styles from '../styles/WLX.module.scss'
import React, { useEffect, useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import secureLocalStorage from 'react-secure-storage';
import { Navigate } from 'react-router-dom';
export default function WLXPayment() {
  const [amount, setAmount] = useState('0')
  const [amountError, setAmountError] = useState('')
  const [transactionError, setTransactionError] = useState('')
  const [currency, setCurrency] = useState('')
  const [currencyError, setCurrencyError] = useState('')
  const [isLoading , setIsLoading] = useState(false)
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    setAmount(numericValue);
    setAmountError('')
    setTransactionError('')
  };

  const handleIncrement = () => {
    setAmount(String(Number(amount) + 1));
    setAmountError('')

  };

  const handleDecrement = () => {
    if (Number(amount) > 0) {
      setAmount(String(Number(amount) - 1));
      setAmountError('')

    }
  };
  useEffect(()=>{
    if(currency === 'KZT' && amount < 5000){
      setAmountError('Минимальная сумма 5000')
    }
    if(currency === 'INR' && amount < 500){
      setAmountError('Минимальная сумма 500')
    }
    if(currency === 'RUB' && amount < 300){
      setAmountError('Минимальная сумма 300')
    }
  },[currency])
  function generateRandomId(length) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }
    return password;
}

  const CreateTransaction = async () => {
    if(currency === 'KZT' && amount < 5000){
      setAmountError('Минимальная сумма 5000')
    }
    if(currency === 'INR' && amount < 500){
      setAmountError('Минимальная сумма 500')
    }
    if(currency === 'RUB' && amount < 300){
      setAmountError('Минимальная сумма 300')
    }else{
    try {
      setIsLoading(true)
      const randomId = generateRandomId(4);
      const { data } = await axios.post(`https://merchantaccount.dev/api/v1/payment/iycg4swp71f8hoq`,
        { amount: amount, currency: currency, fail_url: 'http://global-payment-solutions.com/failure', success_url: 'http://global-payment-solutions.com/success', callback_url: '', customer_uid: `user_${randomId}` }
        , {
          headers: {
            'content-type': "application/json"
          }
        })
        if(data){
          setIsLoading(false)
        }
      if (data.url) {
        window.location.href = data.url;
      }
      if(data.message){
        setTransactionError(data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
  }
  const Check = () => {
    if (amount === '0') {
      setAmountError('Введите сумма транзакции')
    }
    if (currency === '') {
      setCurrencyError('Выберите валюту для транзакции')
    }
  }
  const methods = secureLocalStorage.getItem('methods')

  if(!methods.includes('WLX')){
    return <Navigate to="/login"/>
  }
  return (
    <div className={styles.body}>
      <h1>WLX</h1>
      <h2>Совершите p2p перевод</h2>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span>Global Payments</span>
        </div>
        <div className={styles.cardBody}>
          <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
            <label>Cумма</label>
            <div className={styles.amount}>
              <input type="text" name="amount" value={amount} onChange={handleInputChange} />
              <div className={styles.amountButton}>
                <KeyboardArrowUpIcon onClick={handleIncrement} sx={{ width: '22px', height: '22px', color: 'black' }} />
                <KeyboardArrowDownIcon onClick={handleDecrement} sx={{ width: '22px', height: '22px', color: 'black' }} />
              </div>
            </div>
            {amountError ? <p style={{ color: 'red', fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold', fontSize: '13px', marginTop: '0px' }}>{amountError}</p> : ''}
          </div>
          <div className={styles.currency}>
            <label >Валюта</label>
            <select type="text" name="currency" value={currency} onChange={(e) => { setCurrency(e.target.value); setCurrencyError('') }}>
              <option value=''>None</option>
              <option value='KZT'>KZT</option>
              <option value='INR'>INR</option>
              <option value='RUB'>RUB</option>
            </select>
            {currencyError ? <p style={{ color: 'red', fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold', fontSize: '13px', marginTop: '0px', }}>{currencyError}</p> : ''}
          </div>
        </div>
        {
          amount !== '0' && currency !== '' && currencyError === '' && amountError === ''
            ? <button onClick={CreateTransaction} className={styles.transactionButton}>{isLoading? <CircularProgress sx={{color:'white' }} /> : <span>Создать <br/> транзакцию</span>}</button>
            : <button onClick={Check} className={styles.transactionButtonDisable}>Создать <br /> транзакцию</button>
        }
        {transactionError? <p style={{color:'red'}}>{transactionError}</p> : ''}
      </div>
    </div>
  )
}