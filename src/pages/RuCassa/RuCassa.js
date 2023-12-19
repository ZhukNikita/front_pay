import styles from './RuCassa.module.scss'
import React, { useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CircularProgress from '@mui/material/CircularProgress';
import secureLocalStorage from 'react-secure-storage';
import { Link, Navigate } from 'react-router-dom';
import $api from '../../axios';
import Clipboard from 'react-clipboard.js';

export default function RuCassa() {
  const [amount, setAmount] = useState('0')
  const [amountError, setAmountError] = useState('')
  const [transactionError, setTransactionError] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('')
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    setAmount(numericValue);
    setAmountError('')
    setUrl('')
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

  const CreateTransaction = async () => {
    try {
      setIsLoading(true)
      const { data } = await $api.post(`/rucassaCreate`,
        { amount: amount, brand: secureLocalStorage.getItem('userBrand') }
        , {
          headers: {
            'content-type': "application/json"
          }
        })
      if (data) {
        setIsLoading(false)
        setUrl(data.url)
      }
      if (data.message) {
        setTransactionError(data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
  const Check = () => {
    if (amount === '0') {
      setAmountError('Введите сумма транзакции')
    }
    if(amount.slice(0,1) === '0'){
      setAmountError('Неверно указана сумма')
    }
  }
  const methods = secureLocalStorage.getItem('methods')
  if (!methods.includes('RuCassa')) {
    return <Navigate to="/login" />
  }
  return (
    <div className={styles.body}>
      <h1>RuCassa</h1>
      <h2>Создание платежа</h2>
      <div className={styles.card} style={{ height: '300px' }}>
        <div className={styles.cardHeader}>
          <span>Global Payments</span>
          <Link to={'/'} style={{color:'white'}}>На главную</Link>
          
        </div>
        <div className={styles.cardBody}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <label>Cумма ₽</label>
            <div className={styles.amount} style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <input type="text" style={{ width: '120px' }} placeholder='Сумма ₽' name="amount" value={amount} onChange={handleInputChange} />
              <div className={styles.amountButton}>
                <KeyboardArrowUpIcon onClick={handleIncrement} sx={{ width: '22px', height: '22px', color: 'black' }} />
                <KeyboardArrowDownIcon onClick={handleDecrement} sx={{ width: '22px', height: '22px', color: 'black' }} />
              </div>
            </div>
            {amountError ? <p style={{ color: 'red', fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold', fontSize: '13px', marginTop: '0px' }}>{amountError}</p> : ''}
          </div>
          {
            amount !== '0' && amount.slice(0,1) !== '0' && amountError === ''
              ? <button onClick={CreateTransaction} className={styles.transactionButton}>{isLoading ? <CircularProgress sx={{ color: 'white' }} /> : <span>Создать <br /> транзакцию</span>}</button>
              : <button onClick={Check} className={styles.transactionButtonDisable}>Создать <br /> транзакцию</button>
          }
        </div>

        {transactionError ? <p style={{ color: 'red' }}>{transactionError}</p> : ''}
        {url ? <p style={{ color: 'white', width: '100%', wordBreak: 'break-all' }}>{url}</p> : ''}
        {
          url && (
            <div style={{ width: '100%', wordWrap: 'break-word', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
              <Clipboard style={{ background: 'none', border: 'none' }} data-clipboard-text={url}>
                <button className={styles.Pay} style={{ marginTop: '20px' }} onClick={() => navigator.clipboard.writeText(url)}>Copy</button>
              </Clipboard>
            </div>
          )
        }
        {
          !url && (
            <div>
              <p>Создайте транзакцию для получения ссылки на оплату!</p>
            </div>
          )
        }
      </div>
    </div>
  )
}