import React, { useState, useEffect } from 'react';
import styles from '../styles/P2P.module.scss';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function P2P() {
  const [url, setUrl] = useState('');
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    let countdownWorker;

    if (typeof Worker !== 'undefined') {
      const workerCode = `
        let timer;

        self.onmessage = function(event) {
          if (event.data === 'startCountdown') {
            let seconds = 10;

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

      countdownWorker.onmessage = function(event) {
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
    if (seconds === 10) {
      axios
        .get('http://localhost:5000/p2p')
        .then((response) => {
          setUrl(response.data.IBAN);
        })
        .catch((error) => {
          console.error('Ошибка:', error);
        });
    }
    if(seconds === 0){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Время жизни платежного метода истекло!',
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
