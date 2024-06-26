import React, { useState, useEffect } from 'react';
import styles from '../styles/P2P.module.scss';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Swal from 'sweetalert2';
import Clipboard from 'react-clipboard.js';
import secureLocalStorage from 'react-secure-storage';
import { Navigate, useParams } from 'react-router-dom';
import $api from '../axios';
import WarningIcon from '@mui/icons-material/Warning';

export default function P2P() {
  const [url, setUrl] = useState('');
  const [recipient, setRecipient] = useState('');
  const [bank, setBank] = useState('');
  const [bic, setBic] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [limit, setLimit] = useState('');
  const [seconds, setSeconds] = useState(180);
  const {country} = useParams()
  useEffect(() => {
    let countdownWorker;

    if (typeof Worker !== 'undefined') {
      const workerCode = `
        let timer;

        self.onmessage = function(event) {
          if (event.data === 'startCountdown') {
            let seconds = 180;

            timer = setInterval(() => {
              if (seconds === 0) {
                clearInterval(timer);
                self.postMessage('countdownFinished');
                
              } else {
                seconds--;
                self.postMessage(seconds);
              }
            }, 1000);
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      countdownWorker = new Worker(URL.createObjectURL(blob));

      countdownWorker.onmessage = function (event) {
        if (event.data === 'countdownFinished') {

        } else {
          setSeconds(event.data);
        }
      };
      countdownWorker.postMessage('startCountdown');
    }
    return () => {
      if (countdownWorker) {
        countdownWorker.terminate();
      }
    };
  }, []);
  useEffect(() => {
    if (seconds === 180) {
      $api
        .post(`/p2p/${country}`,{brand:secureLocalStorage.getItem('userBrand')})
        .then((response) => {
          setUrl(response.data.IBAN);
          setRecipient(response.data.Recipient);
          setBank(response.data.Bank);
          setBic(response.data.BIC);
          setAccountNumber(response.data.accountNumber);
          setCountryCode(response.data.countryCode);
          setLimit(response.data.isLimit)
        })
        .catch((error) => {
          console.error('Ошибка:', error);
        });
    }
    if (seconds === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Время для копирования истекло!',
        confirmButtonText: 'На главную',
        willClose: () => {
          window.location.href = '/'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/'
        }
      })
      setUrl('')
    }
  }, [seconds]);
  const methods = secureLocalStorage.getItem('methods')
  if(!methods.includes('P2P')){
    return <Navigate to="/login"/>
  }
  return (
    <div className={styles.body}>
      <h1>P2P</h1>
      <h2>Совершите перевод</h2>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>Global Payments</div>
          <div>
            <span>{('0' + Math.floor((seconds / 60) % 60)).slice(-2)}:</span>
            <span>{('0' + (seconds % 60)).slice(-2)}</span>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.creditsBody}>
            <div className={styles.credits}>
              <span>Iban</span>
              {url ? (
                <h3 style={{ width: '200px', wordBreak: 'break-all' }}>{url}</h3>
              ) : (
                <h3 style={{ width: '210px', wordBreak: 'break-all' }}>Нет свободных IBAN</h3>
              )}
            </div>
            <div className={styles.credits}>
              <span>Получатель</span>
              {recipient ? (
                <h3 style={{ width: '200px', wordBreak: 'break-all' }}>{recipient}</h3>
              ) : (
                <h3 style={{ width: '210px', wordBreak: 'break-all' }}>''</h3>
              )}
            </div>
            <div className={styles.credits}>
              <span>Банк получателя</span>
              {bank ? (
                <h3 style={{ width: '200px', wordBreak: 'break-all' }}>{bank}</h3>
              ) : (
                <h3 style={{ width: '210px', wordBreak: 'break-all' }}>''</h3>
              )}
            </div>
            <div className={styles.credits}>
              <span>БИК банка получателя</span>
              {bic ? (
                <h3 style={{ width: '200px', wordBreak: 'break-all' }}>{bic}</h3>
              ) : (
                <h3 style={{ width: '210px', wordBreak: 'break-all' }}>''</h3>
              )}
            </div>
            <div className={styles.credits}>
              <span>Номер счёта</span>
              {accountNumber ? (
                <h3 style={{ width: '200px', wordBreak: 'break-all' }}>{accountNumber}</h3>
              ) : (
                <h3 style={{ width: '210px', wordBreak: 'break-all' }}>''</h3>
              )}
            </div>
            <div className={styles.credits}>
              <span>Код страны</span>
              {countryCode ? (
                <h3 style={{ width: '200px', wordBreak: 'break-all' }}>{countryCode}</h3>
              ) : (
                <h3 style={{ width: '210px', wordBreak: 'break-all' }}>''</h3>
              )}
            </div>
            <div className={styles.credits} style={{width:'100%'}}>
              {!limit || limit == 0 ? (
                <h3 style={{ width: '200px', wordBreak: 'break-all' }}></h3>
              ) : (
                <div style={{ backgroundColor: 'white', width: '100%', borderRadius: '7px' }}>
                  <div style={{ backgroundColor: 'rgba(255, 237, 193, 0.5)', width: 'calc(100% - 2px)', borderRadius: '8px', border: '1px solid #FFECA1', height: 'calc(100% - 2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <WarningIcon sx={{ color: 'red', marginLeft: '10px' }} />
                      <p style={{ fontSize: '15px', fontFamily: "'Nunito',sans-serif", fontWeight: '600', marginRight: '10px', color: 'red' }}>Возможно данные реквизиты в спамe</p>
                  </div>
                </div>
              )}
            </div>             
          </div>
          {
            url ? <Clipboard data-clipboard-text={`${url + '\n' + recipient + '\n' + bank + '\n' + bic}`}>
              <ContentCopyIcon
                className={styles.cardButton}
                sx={{ padding: '5px', width: '40px', height: '40px', borderRadius: '4px', cursor: 'pointer', border: 'none' }}
              />
            </Clipboard> : ''
          }
        </div>
      </div>
    </div>
  );
}
