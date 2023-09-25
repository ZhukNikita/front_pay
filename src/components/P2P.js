import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/P2P.module.scss';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function P2P() {
  const [url, setUrl] = useState('');
  const [recipient, setRecipient] = useState('');
  const [bank, setBank] = useState('');
  const [bic, setBic] = useState('');
  const [seconds, setSeconds] = useState(180);

  useEffect(() => {
    let countdownWorker;

    if (typeof Worker !== 'undefined') {
      // Если поддерживаются веб-рабочие
      const workerCode = `
        let timer;

        self.onmessage = function(event) {
          if (event.data === 'startCountdown') {
            let seconds = 180;

            timer = setInterval(() => {
              if (seconds === 0) {
                seconds = 180
                clearInterval(timer);
                self.postMessage('countdownFinished');
                
              } else {
                self.postMessage(seconds);
                seconds--;
                seconds--;
                self.postMessage(seconds);
              }
            }, 1000);
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      countdownWorker = new Worker(URL.createObjectURL(blob));

      countdownWorker.onmessage = function(event) {
        if (event.data === 'countdownFinished') {
          // Обратный отсчет завершен
          setSeconds(180);
        } else {
          // Получение обновленного состояния времени от Web Worker
          setSeconds(event.data);
        }
      };

      // Начало обратного отсчета при загрузке компонента
      countdownWorker.postMessage('startCountdown');
    }
    if(seconds === 0){
      countdownWorker.postMessage('countdownFinished')
    }
    if (seconds === 180) {
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
        countdownWorker.terminate(); // Завершение Web Worker при размонтировании компонента
      }
    };
  }, []);

  // useEffect(() => {
  //   if (status === 0 && seconds === 180) {
  //     axios
  //       .get('http://localhost:5000/p2p')
  //       .then((response) => {
  //         setUrl(response.data.IBAN);
  //         console.log(response.data);
  //       })
  //       .catch((error) => {
  //         console.error('Ошибка:', error);
  //       });
  //   }
  // }, [status , seconds]);

  useEffect(() => {
    if (seconds === 180) {
      axios
        .get('http://localhost:5000/p2p')
        .then((response) => {
          setUrl(response.data.IBAN);
          setRecipient(response.data.Recipient);
          setBank(response.data.Bank);
          setBic(response.data.BIC);
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

  return (
    <div className={styles.body}>
      <h1>P2P</h1>
      <h2>Совершите перевод</h2>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>SPB</div>
          <div>Global Payments</div>
          <div>
            <span>{('0' + Math.floor((seconds / 60) % 60)).slice(-2)}:</span>
            <span>{('0' + (seconds % 60)).slice(-2)}</span>
          </div>
        </div>
        <div className={styles.cardBody}>
          {url ? (
            <h3 style={{ width: '200px', wordBreak: 'break-all' }}>{url}</h3>
          ) : (
            <h3 style={{ width: '210px', wordBreak: 'break-all' }}>Нет свободных IBAN</h3>
          )}

          <ContentCopyIcon
            onClick={() => navigator.clipboard.writeText(url)}
            sx={{ padding: '5px', borderRadius: '4px', cursor: 'pointer', border: 'none' }}
          />
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
          </div>
          <ContentCopyIcon
            className={styles.cardButton}
            onClick={() => navigator.clipboard.writeText(url + '\n' + recipient + '\n' + bank + '\n' + bic)}
            sx={{ padding: '5px', width:'40px' , height:'40px', borderRadius: '4px', cursor: 'pointer', border: 'none' }}
          />
          {/* <button style={{ padding: '15px 5px',fontFamily:"'Nunito',sans-serif" , backgroundColor:'#38b6ff', color:'white' ,  borderRadius: '4px', cursor: 'pointer', border: 'none' }}>
                Скопировать
          </button> */}
        </div>
      </div>
    </div>
  );
}
