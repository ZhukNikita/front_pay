import { useEffect, useState } from "react"
import $api from "../../axios"
import styles from './P2PChoose.module.scss'
import NavBar from "../../components/NavBar"
import { Link, Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

export default function P2PChoose(){
    const [countries ,setCountries] = useState([]);

    useEffect(()=>{
        const fetchData = async()=>{
            const {data} = await $api.get('p2pGetAllCountries')
            if(data){
                setCountries(data)
            }
        }
        fetchData()
    },[])
    const methods = secureLocalStorage.getItem('methods')
    if(!methods.includes('P2P')){
      return <Navigate to="/login"/>
    }
    return(
        <div className={styles.choosePage}>
            <Link className={styles.toHome} to={'/'}>Назад</Link>
            <div className={styles.body}>
                {
                    countries.map(el=> <Link to={`/p2p/${el.country}`} key={el.country} className={styles.country}>
                        <p>{el.country}</p>
                        <p>Ibans</p>
                    </Link>)
                }
            </div>
        </div>
    )
}