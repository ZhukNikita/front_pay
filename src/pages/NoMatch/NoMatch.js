import secureLocalStorage from 'react-secure-storage'
import styles from '../../styles/P2P.module.scss'
import {Link} from 'react-router-dom'

export default function NoMatch(){
    const role = secureLocalStorage.getItem('role')
    function getLink(){
        if(role === null) {
            return '/login'
        }
        if(role === 'User') {
            return '/payments_methods'
        }
        if(role === 'Admin' || role === 'SuperAdmin' || role === 'Financier'  ) {
            return '/panel'
        }
    }
    return(
        <div className={styles.body}>
            <h1 style={{color:'#fff' , fontSize:'80px'}}>404</h1>
            <h1 style={{color:'#fff'}}>Такой страницы не существует</h1>
            <Link to={getLink()}
            style={{marginTop:'20px',
            border:'none', 
            backgroundColor:'rgb(56, 182, 255)' , 
            color:'white' , 
            padding:'15px', 
            fontFamily:"'Nunito', sans-serif",
            borderRadius:'6px',
            fontSize:'16px',
            textDecoration:'none'
            }}>На главную</Link>
        </div>
    )
}