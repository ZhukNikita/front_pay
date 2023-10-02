import styles from '../../styles/Panel.module.scss';
import NavBar from '../../components/NavBar';
import AddUsers from '../../components/AddUsers';
import secureLocalStorage from 'react-secure-storage';
import {Navigate} from 'react-router-dom';
export default function Panel() {
    if(!secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/login'}/>
    }
    if(secureLocalStorage.getItem('role') === 'User' && secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/payments_methods'}/>
    }

    return (
        <div className={styles.body}>
            <NavBar/>
            <AddUsers/>
        </div>
    )
}