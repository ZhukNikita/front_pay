import NavBar from '../../components/NavBar'
import styles from './LinkWorldTransactions.module.scss'
import secureLocalStorage from 'react-secure-storage'
import { Navigate } from 'react-router-dom'
import LinkWorldTransactionsBody from './LinkWorldTransactionsBody'


export default function LinkWorldTransactions() {
  if(!secureLocalStorage.getItem('isLogged')){
    return <Navigate to={'/login'}/>
  }
  if(secureLocalStorage.getItem('role') === 'User' && secureLocalStorage.getItem('isLogged')){
    return <Navigate to={'/payments_methods'}/>
  }
  if(!secureLocalStorage.getItem('methods').includes('LinkWorld')){
    return <Navigate to={'/payments_methods'}/>
  }
  return(
    <div className={styles.body}>
      <NavBar/>
      <LinkWorldTransactionsBody/>
    </div>
  )
}