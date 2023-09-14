import styles from '../styles/BrandMenu.module.scss'
import Logo from '../img/GPLogo.png'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {useState} from 'react'
import {Link} from 'react-router-dom'

function BrandMenu() {
    const [brand , setBrand] = useState('0');

  return (
    <div className={styles.body}>
        <div className={styles.logo}>
            <img src={Logo}/>
        </div>
        <h1>Выберите бренд</h1>
        <div className={styles.select}>
            <select value={brand} onChange={(e)=> setBrand(e.target.value)}>
                <option value="0">None</option>
                <option value="SafeInvest">SafeInvest</option>
                <option value="VetalInvest">VetalInvest</option>
            </select>
        </div>
        {
            brand !== '0'? 
                <div className={styles.button}>
                    <Link to={`/payments_methods?brand=${brand}`}>Перейти к методам платежа</Link>
                </div>
            :
                <div className={styles.buttonDisable}>
                    <Link to={`/`}>Перейти к методам платежа</Link>
                </div>
        }
    </div>
  );
}

export default BrandMenu;