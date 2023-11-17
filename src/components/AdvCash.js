import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import styles from '../styles/AdvCash.module.scss';
import $api from '../axios'
export default function AdvCashPaymentLink() {
    const [amount , setAmount] = useState('')
    const [sign , setSign] = useState('')
    const [orderId , setOrderId] = useState('')
    if(!secureLocalStorage.getItem('isLogged') || !secureLocalStorage.getItem('methods').includes('AdvCash')){
        return <Navigate to={'/payments_methods'}/>
    }
    async function onClick (){
        try{
            const {data} = await $api.post('/getSign' , {amount : Number(amount)})
            setSign(data.signature)
            setOrderId(data.orderId)
        }catch(e){
            console.log(e)
        }
    }
    const generatePaymentLink = () => {
        return `https://wallet.advcash.com/sci/?ac_account_email=zantdeyker8@outlook.com&ac_sci_name=global-academy&ac_amount=12&ac_currency=USD&ac_order_id=12345672&ac_success_url=https://global-academy.work/success&ac_success_url_method=GET&ac_fail_url=https://global-academy.work/failure&ac_fail_url_method=GET&ac_status_url=https://global-academy.work/status&ac_status_url_method=GET&ac_comments=Brand`;
    };
    return (
        <div className={styles.body}>
            <label>Сумма</label>
            <input className={styles.amount} type='number' onChange={(e)=> setAmount(e.target.value)}/>

            <button className={styles.create} onClick={onClick}>Создать</button>
            {sign?<a href={generatePaymentLink()} target="_blank" rel="noopener noreferrer" style={{color:'white' , width :'200px'}}>
            {generatePaymentLink()}
            </a>: ''}

        </div>
    );
}