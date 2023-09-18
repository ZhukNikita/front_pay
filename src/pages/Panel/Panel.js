import styles from '../../styles/Panel.module.scss'
import NavBar from '../../components/NavBar'
import AddUsers from '../../components/AddUsers'
export default function Panel() {
    return (
        <div className={styles.body}>
            <NavBar/>
            <AddUsers/>
        </div>
    )
}