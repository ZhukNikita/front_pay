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
        <div class={styles.select}>
            <select value={brand} onChange={(e)=> setBrand(e.target.value)}>
                <option value="0">None</option>
                <option value="1">Brand 1</option>
                <option value="2">Brand 2</option>
                <option value="3">Brand 3</option>
            </select>
        </div>
        {
            brand !== '0'? 
                <div className={styles.button}>
                    <Link to={`https://front-pay.vercel.app/payments_methods?brand=${brand}`}>Перейти к методам платежа</Link>
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