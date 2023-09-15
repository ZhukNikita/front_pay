import { useState , useEffect , useRef } from 'react';
import styles from '../styles/P2P.module.scss'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios'
import { useLocation } from 'react-router-dom';

let timer;
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
        if (!timer) {
          timer = setInterval(() => {
            setSeconds((prevSeconds) => {
              if (prevSeconds === 0) {
                clearInterval(timer);
                timer = null;
                return 0;
              } else {
                return prevSeconds - 1;
              }
            });
          }, 1000);
        }
    
        return () => {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
        };
      }, []);

      // useEffect(()=>{
      //   if(status === 0){
      //     axios.get('http://localhost:5000/p2p')
      //     .then(response => {
      //       setUrl(response.data.IBAN)
  
      //       console.log(response.data);
      //     })
      //     .catch(error => {
      //       console.error('Ошибка:', error);
      //     });
      //   }
      // }, [status])

      useEffect(() => {
        if (seconds === 0) {
          setStatus(0)
          setSeconds(180);
          console.log(1)
        }else{
          setStatus(1)
        }
      }, [seconds]);

      if(pathname !== '/p2p'){
        localStorage.removeItem('key')
        localStorage.removeItem('iban')
      }
    return(
        <div className={styles.body}>
            <h1>P2P</h1>
            <h2>Совершите перевод</h2>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div>SPB</div>
                    <div>
                        <span>{('0' + Math.floor((seconds / 60) % 60)).slice(-2)}:</span>
                        <span>{('0' + Math.floor((seconds ) % 60)).slice(-2)}</span>
                    </div>
                </div>
                <div className={styles.cardBody}>
                    {url?<h3 style={{width:'200px' ,wordBreak:'break-all'}}>{url}</h3>: <h3 style={{width:'210px' ,wordBreak:'break-all'}}>Нет свободных IBAN</h3>}
                    
                    <ContentCopyIcon onClick={()=> navigator.clipboard.writeText(url)} sx={{padding:'5px' , borderRadius:'4px' , cursor:'pointer' , border:'none'}}/>
                </div>
            </div>
        </div>
    )
}