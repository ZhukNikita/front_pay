import styles from '../styles/Navbar.module.scss'
import Logo from '../img/GPLogo.png'
import React from "react";
import {Link, useLocation} from "react-router-dom";
import secureLocalStorage from 'react-secure-storage';


export default function NavBar() {

    return(
        <div className={styles.body}>
            <div className={styles.content}>
                <img className={styles.logo} src={Logo} alt='logo'/>
                {/* <h2>Платежные методы</h2> */}
                <div className={styles.paymentsList}>
                    <Link to={'/pinpay-transactions'} className={styles.payment} style={{textDecoration:'none'}}>Транзакции Pinpay</Link>
                    <Link to={'/insirex-transactions'} className={styles.payment} style={{textDecoration:'none'}}>Транзакции Inserix</Link>
                    <Link to={'/p2p-transactions'} className={styles.payment} style={{textDecoration:'none'}}>Транзакции P2P</Link>
                    <Link to={'/wlx-transactions'} className={styles.payment} style={{textDecoration:'none'}}>Транзакции WLX</Link>
                    {/* <Link to={'/transactions'} className={styles.payment} style={{textDecoration:'none'}}>Транзакции</Link> */}
                    <Link to={'/panel'} className={styles.payment} style={{textDecoration:'none'}}>Пользователи</Link>
                    <Link to={'/methods'} className={styles.payment} style={{textDecoration:'none'}}>Платёжные методы</Link>
                </div>
            </div>

            <button className={styles.logout} onClick={()=>{secureLocalStorage.removeItem('isLogged') ; secureLocalStorage.removeItem('role') ; secureLocalStorage.removeItem('userId') ; window.location.href = 'http://localhost:3000/login'}}>Вийти</button>
        </div>
    )
}