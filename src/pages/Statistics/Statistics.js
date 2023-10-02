import styles from './Statistics.module.scss'
import NavBar from '../../components/NavBar'
import StatisticsBody from './StatisticsBody'
export default function Statistics() {
    return(
        <div className={styles.body}>
            <NavBar/>
            <StatisticsBody/>
        </div>
    )
}