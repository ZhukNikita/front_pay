import styles from '../styles/WLX.module.scss'
import React, { useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
export default function WLXPayment() {
  const [amount, setAmount] = useState('0')
  const [amountError, setAmountError] = useState('')
  const [currency, setCurrency] = useState('')
  const [currencyError, setCurrencyError] = useState('')
  const [isLoading , setIsLoading] = useState(false)
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    setAmount(numericValue);
    setAmountError('')
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
    setIsLoading(true)
    try {
      const randomId = generateRandomId(4);
      const { data } = await axios.post(`https://merchantaccount.dev/api/v1/payment/iycg4swp71f8hoq`,
        { amount: amount, currency: currency, fail_url: 'https://global-payment-solutions.com/failure', success_url: 'https://global-payment-solutions.com/success', callback_url: '', customer_uid: `user_${randomId}` }
        , {
          headers: {
            'content-type': "application/json"
          }
        })
      if (data.url) {
        setIsLoading(false)
        window.location.href = data.url;
      }
    } catch (e) {
      console.log(e)
    }
  }
  const Check = () => {
    if (amount === '0') {
      setAmountError('Введите сумма транзакции')
    }
    if (currency === '') {
      setCurrencyError('Введите валюту для транзакции')
    }
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
              <option value='MDL'>MDL</option>
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
      </div>
    </div>
  )
}