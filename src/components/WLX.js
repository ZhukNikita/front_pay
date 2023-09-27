import styles from '../styles/WLX.module.scss'
import React, {useState} from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default  function WLXPayment() {
  const [amount ,setAmount] = useState(0)

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    setAmount(numericValue);
  };

  const handleIncrement = () => {
      setAmount(String(Number(amount) + 1));
  };

  const handleDecrement = () => {
    if (Number(amount) > 0) {
      setAmount(String(Number(amount) - 1));
    }
  };
  console.log(amount)
  return(
    <div className={styles.body}>
      <h1>WLX</h1>
      <h2>Совершите p2p перевод</h2>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span>Global Payments</span>
        </div>
        <div className={styles.cardBody}>
          <label htmlFor="">Cумма</label>
          <div className={styles.amount}>
            <input type="text" name="amount" value={amount} onChange={handleInputChange}/>
            <div className={styles.amountButton}>
              <KeyboardArrowUpIcon onClick={handleIncrement} sx={{width:'22px',height:'22px',color:'black'}}/>
              <KeyboardArrowDownIcon onClick={handleDecrement} sx={{width:'22px',height:'22px',color:'black'}}/>
            </div>
          </div>
          <input type="text" name="amount"/>
        </div>
      </div>
    </div>
  )
}