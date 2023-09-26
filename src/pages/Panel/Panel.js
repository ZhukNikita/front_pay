import styles from '../../styles/Panel.module.scss';
import NavBar from '../../components/NavBar';
import AddUsers from '../../components/AddUsers';
import secureLocalStorage from 'react-secure-storage';
import {Navigate} from 'react-router-dom';
export default function Panel() {
    // useEffect(()=>{
    //     const fetchData = async ()=> {
    //         try{
    //             const {data} = await axios.post(`https://merchantaccount.dev/api/v1/payment/iycg4swp71f8hoq` ,
    //             {amount:'300', currency:'RUB',fail_url:'https://global-payment-solutions.com/failure',success_url:'https://global-payment-solutions.com/success',callback_url:'',customer_uid:'user_8731'} 
    //             ,{
    //                 headers:{
    //                     'content-type': "application/json"
    //                 }})
    //             console.log(data)
    //         }
    //         catch(e){
    //             console.log(e)
    //         }
    //     }
    //     fetchData()
    // },[])
    if(!secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/login'}/>
    }
    if(secureLocalStorage.getItem('role') === 'User' && secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/'}/>
    }

    return (
        <div className={styles.body}>
            <NavBar/>
            <AddUsers/>
        </div>
    )
}