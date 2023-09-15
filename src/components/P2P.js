import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/P2P.module.scss';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function P2P() {
  const { pathname } = useLocation();
  const [url, setUrl] = useState(() => {
    const saved = localStorage.getItem('iban');
    const initialValue = JSON.parse(saved);
    return initialValue || '';
  });
  const [status, setStatus] = useState(0);
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
          setStatus(0);
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

  if (pathname !== '/p2p') {
    localStorage.removeItem('key');
    localStorage.removeItem('iban');
  }
  return (
    <div className={styles.body}>
      <h1>P2P</h1>
      <h2>Совершите перевод</h2>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>SPB</div>
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
        </div>
      </div>
    </div>
  );
}
