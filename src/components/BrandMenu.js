import styles from '../styles/BrandMenu.module.scss'
import Logo from '../img/GPLogo.png'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {useState} from 'react'
import {Link, Navigate} from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage';

function BrandMenu() {
    const [brand , setBrand] = useState('0');

    if(secureLocalStorage.getItem('isLogged') === null){
        return <Navigate to={'/login'}/>
    }
    if(secureLocalStorage.getItem('isLogged') !== null){
        return <Navigate to={'/payments_methods'}/>

    }
  return (
    <div className={styles.body}>
        {/* <div className={styles.logo}>
            <img src={Logo}/>
        </div>
        <h1>Выберите бренд</h1>
        <div className={styles.select}>
            <select value={brand} onChange={(e)=> setBrand(e.target.value)}>
                <option value="0">None</option>
                <option value="SafeInvest">SafeInvest</option>
                <option value="VitalInvest">VitalInvest</option>
                <option value="RiseInvest">RiseInvest</option>
                <option value="Revolut">Revolut</option>
                <option value="InfinityInvest">InfinityInvest</option>
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
        } */}
    </div>
  );
}

export default BrandMenu;