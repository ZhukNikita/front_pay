import { useState , useEffect } from 'react';
import styles from '../styles/P2P.module.scss'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function P2P(targetDate) {
    const [time, setTime] = useState(() => {
        const saved = localStorage.getItem('key');
        const initialValue = JSON.parse(saved);
        return initialValue || 15000;
      });
      const [url, setUrl] = useState('');
      const [timeOn, setTimeOn] = useState(true);
      const [usedUrls, setUsedUrls] = useState([]);
      const urls = ['UA903052992990004149123456789', 'UA903052992990004149123456710', 'UA903052992990004149123456711', 'UA903052992990004149123456712'];
    
      useEffect(() => {
        localStorage.setItem('key', time);
      }, [time]);
    
      useEffect(() => {
        if (timeOn) {
          const interval = setInterval(() => {
            setTime((prevState) => prevState - 10);
          }, 10);
          return () => clearInterval(interval);
        }
      }, [timeOn]);
    
      useEffect(() => {
        if (time < 0) {
          setTime(15000);
          const unusedUrls = urls.filter((el) => !usedUrls.includes(el));
          if (unusedUrls.length === 0) {
            setUsedUrls([]);
          }
          const randomIndex = Math.floor(Math.random() * unusedUrls.length);
          const newUrl = unusedUrls[randomIndex];
          setUrl(newUrl);
          setUsedUrls((prevUsedUrls) => [...prevUsedUrls, newUrl]);
        }
      }, [time, usedUrls, urls]);
    return(
        <div className={styles.body}>
            <h1>P2P</h1>
            <h2>Совершите перевод</h2>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div>SPB</div>
                    <div>
                        <span>{('0' + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                        <span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}</span>
                    </div>
                </div>
                <div className={styles.cardBody}>
                    <h3 style={{width:'200px' ,wordBreak:'break-all'}}>{url}</h3>
                    <ContentCopyIcon className={styles.cardButton} onClick={()=> navigator.clipboard.writeText(url)} sx={{padding:'5px'   , borderRadius:'4px' , cursor:'pointer'}}/>
                </div>
            </div>
        </div>
    )
}