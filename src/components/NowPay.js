import React, { useState } from 'react';
import {Link, Navigate} from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import styles from '../styles/Shp.module.scss';
import $api from '../axios'
import safeInvest from '../img/SafeInvest.png'
import stripe from '../img/stripe.png'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Clipboard from 'react-clipboard.js';
import { Oval } from 'react-loader-spinner';
import {decode as base64_decode, encode as base64_encode} from 'base-64';
export default function Shp() {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('usd')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!secureLocalStorage.getItem('isLogged') || !secureLocalStorage.getItem('methods').includes('shp.ee')) {
    return <Navigate to={'/payments_methods'} />
  }
  const generatePaymentLink = async () => {
    setUrl('')
    if (!/^\d+$/.test(amount)) {
      setError("Ошибка: Cумма содержит буквы!");
      return
    }
    try {
      setIsLoading(true)
      if (amount) {
        const brand = secureLocalStorage.getItem('userBrand')
        const {data} = await  $api.post('/createPaymentNow' ,{amount , brand, currency})
        if(data){
          setUrl(data)

        }
        setIsLoading(false)
      }
      else {
        setIsLoading(false)
        setError('Введите сумму')
      }
    } catch (e) {
      console.log(e)
    }
  };
  return (
    <div className={styles.login}>
      <div className={styles.leftSide}>
        <h2 style={{marginTop:'0px'}}>Сумма:</h2>
        <p style={{ fontSize: '26px' }}>{amount} $</p>
        <h2>Cсылка:</h2>
        <p style={{ fontSize: '16px', wordBreak: 'break-all' }}>{url}</p>
        {isLoading && (
          <Oval
            height={80}
            width={80}
            color="#181729"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#b7dce9"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        )}
        {
          url ? <Clipboard data-clipboard-text={`${url}`}>
            <ContentCopyIcon
              className={styles.cardButton}
              sx={{ padding: '5px', width: '40px', height: '40px', borderRadius: '4px', cursor: 'pointer', border: 'none'  , color:"white"}}
            />
          </Clipboard> : ''
        }
      </div>
      <div className={styles.body}>
        <Link to={'/'}>
          На главную
        </Link>
        <h1 style={{ marginTop: '0'  , color:'white'}}>NowPay</h1>
        <div className={styles.input}>
          <label>Сумма</label>
          <input type='text' name='Amount' placeholder='Сумма' onChange={(e) => {setAmount(e.target.value); setError('')}} />

        </div>

        <div className={styles.input} style={{ marginTop: '15px' }}>
          <label>Валюта</label>
          <select type='password' name='Currency' placeholder='Валюта' onChange={(e) => setCurrency(e.target.value)}>
            <option value={'usd'}>USD</option>
            <option value={'eur'}>EUR</option>
            <option value={'ron'}>RON</option>
            <option value={'cad'}>CAD</option>
            <option value={'gbp'}>GBP</option>
            <option value={'krw'}>KRW</option>
            <option value={'ils'}>ILS</option>
            <option value={'ars'}>ARS</option>
            <option value={'inr'}>INR</option>
            <option value={'idr'}>IDR</option>
            <option value={'mxn'}>MXN</option>
            <option value={'myr'}>MYR</option>
            <option value={'try'}>TRY</option>
            <option value={'clp'}>CLP</option>
            <option value={'pen'}>PEN</option>
            <option value={'php'}>PHP</option>
            <option value={'thb'}>THB</option>
            <option value={'vnd'}>VND</option>
            <option value={'pln'}>PLN</option>
            <option value={'brl'}>BRL</option>
          </select>
        </div>
        <button className={amount ? styles.Button : styles.Disable} onClick={generatePaymentLink}>Создать</button>
        {error && (<p style={{color:'red'}}>{error}</p>)}
      </div>
    </div>
  );
}