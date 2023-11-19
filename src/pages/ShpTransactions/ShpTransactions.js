import NavBar from '../../components/NavBar'
import styles from './ShpTransactions.module.scss'
import ShpTransactionsBody from './ShpTransactionsBody'
import secureLocalStorage from 'react-secure-storage'
import { Navigate } from 'react-router-dom'


export default function ShpTransactions() {
  if(!secureLocalStorage.getItem('isLogged')){
    return <Navigate to={'/login'}/>
  }
  if(secureLocalStorage.getItem('role') === 'User' && secureLocalStorage.getItem('isLogged')){
    return <Navigate to={'/payments_methods'}/>
  }
  if(!secureLocalStorage.getItem('methods').includes('shp.ee')){
    return <Navigate to={'/payments_methods'}/>
  }
  return(
    <div className={styles.body}>
      <NavBar/>
      <ShpTransactionsBody/>
    </div>
  )
}