import React, { useState } from 'react';
import {Link, Navigate} from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import styles from '../styles/Shp.module.scss';
import $api from '../axios'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Clipboard from 'react-clipboard.js';
import { Oval } from 'react-loader-spinner';

export default function LinkPay() {
  const [amount, setAmount] = useState(100)
  const [currency, setCurrency] = useState('usd')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!secureLocalStorage.getItem('isLogged') || !secureLocalStorage.getItem('methods').includes('LinkPay')) {
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
      if (amount && currency) {
        const brand = secureLocalStorage.getItem('userBrand');
        const {data} = await  $api.post('/createLink',{amount : amount * 100,currency,brand})
        console.log(data)
        setUrl(data.paymentUrl)
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
        <p style={{ fontSize: '26px' }}>{amount} {amount? (currency.toUpperCase()): ""}</p>
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
        <h1 style={{ marginTop: '0'  , color:'white'}}>LinkPay</h1>
        <div className={styles.input}>
          <label>Сумма</label>
          {currency === 'ron' &&(<select type='text' name='Amount' placeholder='Сумма' onChange={(e) => {
            setAmount(e.target.value); setUrl('')
          }}>
            <option value={453}>453 ron</option>
            <option value={680}>680 ron</option>
            <option value={906}>906 ron</option>
            <option value={1133}>1133 ron</option>
            <option value={2266}>2266 ron</option>
            <option value={4533}>4533 ron</option>
          </select>)}
          {currency === 'usd' &&(<select type='text' name='Amount' placeholder='Сумма' onChange={(e) => {
            setAmount(e.target.value); setUrl('')
          }}>
            <option value={100}>100 $</option>
            <option value={150}>150 $</option>
            <option value={200}>200 $</option>
            <option value={250}>250 $</option>
            <option value={500}>500 $</option>
            <option value={1000}>1000 $</option>
          </select>)}
        </div>
        <div className={styles.input} style={{ marginTop: '15px' }}>
          <label>Валюта</label>
          <select type='password' name='Currency' placeholder='Валюта' onChange={(e) => {
            setCurrency(e.target.value);
            if(e.target.value === 'ron'){
              setAmount(453)
            }
            ; setUrl('')
            if(e.target.value === 'usd'){
              setAmount(100)
            }
          }}>
            <option value={'usd'}>USD</option>
            <option value={'ron'}>RON</option>
          </select>
        </div>
        <button className={amount && currency ? styles.Button : styles.Disable} onClick={generatePaymentLink}>Создать</button>
        {error && (<p style={{color:'red'}}>{error}</p>)}
      </div>
    </div>
  );
}