import styles from './Statistics.module.scss'
import NavBar from '../../components/NavBar'
import StatisticsBody from './StatisticsBody'
import secureLocalStorage from 'react-secure-storage'
import { Navigate } from 'react-router-dom'
export default function Statistics() {

    if(!secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/login'}/>
    }
    if(secureLocalStorage.getItem('role') === 'User' && secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/payments_methods'}/>
    }
    return(
        <div className={styles.body}>
            <NavBar/>
            <StatisticsBody/>
        </div>
    )
}