import secureLocalStorage from "react-secure-storage";
import NavBar from "../../components/NavBar";
import styles from './AllTransactions.module.scss'
import { Link, Navigate } from "react-router-dom";
let wallet = <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" style={{fill:"#b7dce9"}}><path d="M20 7V5c0-1.103-.897-2-2-2H5C3.346 3 2 4.346 2 6v12c0 2.201 1.794 3 3 3h15c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2zm-2 9h-2v-4h2v4zM5 7a1.001 1.001 0 0 1 0-2h13v2H5z"></path></svg> 

export default function AllTransations(){
    const methods = secureLocalStorage.getItem('methods')
    if(!secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/login'}/>
    }
    return(
        <div className={styles.body}>
            <NavBar/>
            <div className={styles.content}>
            <h1>Транзакции</h1>
            <div className={styles.transactions}>
            {
                       methods.map((el)=>
                        <Link to={`/${el}-transactions`} key={el} className={styles.transaction} style={{textDecoration:'none'}}>
                        {wallet}
                        {el}</Link>
                       )
                    }
            </div>
            </div>
        </div>
    )
}