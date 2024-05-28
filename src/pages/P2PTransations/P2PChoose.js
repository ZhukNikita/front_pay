import { useEffect, useState } from "react"
import $api from "../../axios"
import styles from './P2PChoose.module.scss'
import NavBar from "../../components/NavBar"
import { Link, Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import Countries from '../../countries.json';

export default function P2PChoose(){
    const [countries ,setCountries] = useState([]);
    useEffect(()=>{
        const fetchData = async()=>{
            const {data} = await $api.post('p2pGetAllCountries',{brand:secureLocalStorage.getItem('userBrand')})
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
    console.log()
    return(
        <div className={styles.choosePage}>
            <Link className={styles.toHome} to={'/'}>Назад</Link>
            <div className={styles.body}>
                {
                    countries.map(el=> <Link to={`/p2p/${el.country}`} key={el.country} className={styles.country}>
                        <img src={Countries.find(elem=> (elem.name.common.includes(el.country) || elem.altSpellings.includes(el.country.slice(0,2))))?.flags?.png} alt='Contry' width={50}/>
                        <p>{el.country}</p>
                    </Link>)
                }
            </div>
        </div>
    )
}