import styles from '../styles/P2P.module.scss'
export default function NoMatch(){
    return(
        <div className={styles.body}>
            <h1 style={{color:'#fff' , fontSize:'80px'}}>404</h1>
            <h1 style={{color:'#fff'}}>Такой страницы не существует</h1>
        </div>
    )
}