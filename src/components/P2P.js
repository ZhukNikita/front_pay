import { useState , useEffect , useRef } from 'react';
import styles from '../styles/P2P.module.scss'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useClickAnimation } from "../hooks/UseAnimationClick";

export default function P2P() {
    const buttonRef = useRef();
    useClickAnimation(buttonRef, {
        color: "black",
        size: 50,
        duration: 600,
        effectName: "ripple"
      });
    const [time, setTime] = useState(() => {
        const saved = localStorage.getItem('key');
        const initialValue = JSON.parse(saved);
        return initialValue || 180000;
      });
      const [url, setUrl] = useState(() => {
        const saved = localStorage.getItem('iban');
        const initialValue = JSON.parse(saved);
        return initialValue || '';
      });
      const [timeOn, setTimeOn] = useState(true);
      const [usedUrls, setUsedUrls] = useState([]);
      const urls = ['UA903052992990004149123456789', 'UA903052992990004149123456710', 'UA903052992990004149123456711', 'UA903052992990004149123456712'];
    
      useEffect(() => {
        localStorage.setItem('key', time);
      }, [time]);
      useEffect(() => {
        localStorage.setItem('iban', JSON.stringify(url));
      }, [url]);
    
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
          setTime(180000);
          const unusedUrls = urls.filter((el) => !usedUrls.includes(el));
          if (unusedUrls.length === 0) {
            setUsedUrls([]);
            setUrl('');
          } else {
            const randomIndex = Math.floor(Math.random() * unusedUrls.length);
            const newUrl = unusedUrls[randomIndex];
            setUrl(newUrl);
            setUsedUrls((prevUsedUrls) => [...prevUsedUrls, newUrl]);
          }
        }
      }, [time, usedUrls, urls]);
      useEffect(() => {
        if (url === '') {
          setUrl(urls[Math.floor(Math.random() * urls.length)]);
        }
      }, [url, urls]);
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
                    
                    <button  ref={buttonRef} onClick={()=> navigator.clipboard.writeText(url)} style={{padding:'5px'   , borderRadius:'4px' , cursor:'pointer'}}><ContentCopyIcon /></button>
                </div>
            </div>
        </div>
    )
}