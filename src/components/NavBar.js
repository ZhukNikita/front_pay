import styles from '../styles/Navbar.module.scss'
import Logo from '../img/GPLogo.png'
import React from "react";
import {Link} from "react-router-dom";
import secureLocalStorage from 'react-secure-storage';
import GroupIcon from '@mui/icons-material/Group';
let wallet = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{fill:"#b7dce9"}}><path d="M20 7V5c0-1.103-.897-2-2-2H5C3.346 3 2 4.346 2 6v12c0 2.201 1.794 3 3 3h15c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2zm-2 9h-2v-4h2v4zM5 7a1.001 1.001 0 0 1 0-2h13v2H5z"></path></svg> 
export default function NavBar() {
    const methods = secureLocalStorage.getItem('methods')
    return(
        <div className={styles.body}>
            <div className={styles.content}>
                <img className={styles.logo} src={Logo} alt='logo'/>
                {/* <h2>Платежные методы</h2> */}
                <div className={styles.paymentsList}>
                    {
                       methods.map((el)=>
                        <Link to={`/${el}-transactions`} className={styles.payment} style={{textDecoration:'none'}}>
                        {wallet}
                        Транзакции {el}</Link>
                       )
                    }
                    {/* <Link to={'/pinpay-transactions'} className={styles.payment} style={{textDecoration:'none'}}>
                        {wallet}
                        Транзакции Pinpay</Link>
                    <Link to={'/insirex-transactions'} className={styles.payment} style={{textDecoration:'none'}}>{wallet}Транзакции Insirex</Link>
                    <Link to={'/p2p-transactions'} className={styles.payment} style={{textDecoration:'none'}}>{wallet}Транзакции P2P</Link>
                    <Link to={'/wlx-transactions'} className={styles.payment} style={{textDecoration:'none'}}>{wallet}Транзакции WLX</Link>
                    <Link to={'/advcash-transactions'} className={styles.payment} style={{textDecoration:'none'}}>{wallet}Транзакции AdvCash</Link> */}
                    <Link to={'/statistics'} className={styles.payment} style={{textDecoration:'none'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{fill: "#b7dce9"}}><path d="M13 2.051V11h8.949c-.47-4.717-4.232-8.479-8.949-8.949zm4.969 17.953c2.189-1.637 3.694-4.14 3.98-7.004h-8.183l4.203 7.004z"></path><path d="M11 12V2.051C5.954 2.555 2 6.824 2 12c0 5.514 4.486 10 10 10a9.93 9.93 0 0 0 4.255-.964s-5.253-8.915-5.254-9.031A.02.02 0 0 0 11 12z"></path></svg>
                        Статистика</Link>
                    {/* <Link to={'/transactions'} className={styles.payment} style={{textDecoration:'none'}}>Транзакции</Link> */}
                    <Link to={'/panel'} className={styles.payment} style={{textDecoration:'none'}}><GroupIcon/>Пользователи</Link>
                    <Link to={'/methods'} className={styles.payment} style={{textDecoration:'none'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{fill: "#b7dce9"}}><path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm-7.5 12a2.5 2.5 0 1 1 0-5 2.47 2.47 0 0 1 1.5.512c-.604.456-1 1.173-1 1.988s.396 1.532 1 1.988a2.47 2.47 0 0 1-1.5.512zm4 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path></svg>
                        Платёжные методы</Link>
                </div>
            </div>

            <button className={styles.logout} 
            onClick={()=>{secureLocalStorage.removeItem('isLogged') ;
             secureLocalStorage.removeItem('role') ;
              secureLocalStorage.removeItem('userId') ;
              secureLocalStorage.removeItem('brands') ;
              secureLocalStorage.removeItem('methods') ;
               window.location.href = '/login'}}>Вийти</button>
        </div>
    )
}